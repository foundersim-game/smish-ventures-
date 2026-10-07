import { NextResponse } from "next/server";
import { RoomService } from "../../../../../backend/services/room.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { playerName, avatar, playerId } = body;

    const result = await RoomService.joinRoom({
      roomCode: code,
      playerName,
      avatar,
      playerId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to join room";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
