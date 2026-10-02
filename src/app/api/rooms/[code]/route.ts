import { NextResponse } from "next/server";
import { RoomRepository } from "../../../../backend/repositories/room.repository";
import { RoomService } from "../../../../backend/services/room.service";
import { ScenarioRegistry } from "../../../../backend/data/scenarios";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const repo = RoomRepository.getInstance();
  const room = repo.findByCode(code);

  if (!room) {
    return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
  }

  const players = repo.getPlayers(room.id);
  const scenario = ScenarioRegistry.getById(room.scenarioId);

  return NextResponse.json({
    success: true,
    room,
    players,
    scenario,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { hostPlayerId, settings } = body;

    const updated = RoomService.updateSettings(code, hostPlayerId, settings);
    return NextResponse.json({ success: true, room: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update room";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
