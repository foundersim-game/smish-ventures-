import { NextResponse } from "next/server";
import { RoomRepository } from "../../../../backend/repositories/room.repository";
import { RoomService } from "../../../../backend/services/room.service";
import { ScenarioRegistry } from "../../../../backend/data/scenarios";
import { GameplayService } from "../../../../backend/services/gameplay.service";
import { getSupabaseClient } from "../../../../services/supabase/supabase-client";
import { VoteEvaluator } from "../../../../core/engine/vote-evaluator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const repo = RoomRepository.getInstance();
  const room = await repo.findByCode(code);

  if (!room) {
    return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
  }

  const players = await repo.getPlayers(room.id);
  const scenario = ScenarioRegistry.getById(room.scenarioId);

  const isRevealOrAfter =
    room.phase.startsWith("reveal_") ||
    room.phase === "consequence" ||
    room.phase === "round_wrap" ||
    room.phase === "influence" ||
    room.phase === "blame";

  let resolution: any = isRevealOrAfter
    ? GameplayService.getCurrentResolution(room.id, room.currentRoundIndex) || null
    : null;
  let consequence: any = isRevealOrAfter
    ? GameplayService.getCurrentConsequence(room.id, room.currentRoundIndex) || null
    : null;

  if (isRevealOrAfter && (!resolution || !consequence)) {
    try {
      const supabase = getSupabaseClient();
      const { data: dbData } = await supabase
        .from("round_receipts")
        .select("data")
        .eq("room_id", room.id)
        .eq("round_index", room.currentRoundIndex)
        .maybeSingle();

      if (dbData?.data) {
        if (!resolution && dbData.data.resolution && dbData.data.resolution.roundIndex === room.currentRoundIndex) {
          resolution = dbData.data.resolution;
        }
        if (!consequence && dbData.data.consequence) {
          consequence = dbData.data.consequence;
        }
      }
    } catch {
      // Ignored
    }
  }

  // If in reveal/consequence/blame phase and resolution is not set, dynamically evaluate from actual round options and players
  if (isRevealOrAfter && (!resolution || resolution.roundIndex !== room.currentRoundIndex)) {
    const currentRound = scenario?.rounds[room.currentRoundIndex - 1];
    if (currentRound && players.length > 0) {
      resolution = VoteEvaluator.evaluateRound(room.currentRoundIndex, currentRound.options, players);
    }
  }

  return NextResponse.json(
    {
      success: true,
      room,
      players,
      scenario,
      resolution,
      consequence,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { hostPlayerId, settings } = body;

    const updated = await RoomService.updateSettings(code, hostPlayerId, settings);
    return NextResponse.json({ success: true, room: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update room";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
