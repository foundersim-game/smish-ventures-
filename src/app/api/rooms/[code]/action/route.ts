import { NextResponse } from "next/server";
import { GameplayService } from "../../../../../backend/services/gameplay.service";
import { BlameService } from "../../../../../backend/services/blame.service";
import { MonetizationService } from "../../../../../backend/services/monetization.service";
import { RoomService } from "../../../../../backend/services/room.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { action, playerId, payload } = body;

    switch (action) {
      case "START_GAME": {
        const room = await GameplayService.startGame(code, playerId);
        return NextResponse.json({ success: true, room });
      }

      case "LOCK_INITIAL_VOTE": {
        await GameplayService.lockInitialVote(code, playerId, payload.optionId);
        return NextResponse.json({ success: true });
      }

      case "EXTEND_DISCUSSION": {
        const room = await GameplayService.extendDiscussion(code, playerId, payload?.seconds || 30);
        return NextResponse.json({ success: true, room });
      }

      case "SKIP_DISCUSSION": {
        const room = await GameplayService.transitionToFinalVote(code);
        return NextResponse.json({ success: true, room });
      }

      case "LOCK_FINAL_VOTE": {
        await GameplayService.lockFinalVote(code, playerId, payload.optionId);
        return NextResponse.json({ success: true });
      }

      case "ADVANCE_REVEAL_BEAT": {
        const room = await GameplayService.advanceRevealBeat(code, payload.targetBeat);
        return NextResponse.json({ success: true, room });
      }

      case "NEXT_ROUND": {
        const room = await GameplayService.nextRound(code, playerId);
        return NextResponse.json({ success: true, room });
      }

      case "TRIGGER_BUZZER": {
        await GameplayService.triggerBuzzer(code, playerId, payload.buzzerType);
        return NextResponse.json({ success: true });
      }

      case "TRIGGER_EMOJI_REACTION": {
        await GameplayService.triggerEmojiReaction(code, playerId, payload.emoji);
        return NextResponse.json({ success: true });
      }

      case "ADD_BOT_PLAYER": {
        const res = await RoomService.addBotPlayer(code, payload?.name, payload?.avatar);
        return NextResponse.json({ success: true, ...res });
      }

      case "KICK_PLAYER": {
        await RoomService.kickPlayer(code, playerId, payload.targetPlayerId);
        return NextResponse.json({ success: true });
      }

      case "LEAVE_ROOM": {
        await RoomService.kickPlayer(code, playerId, playerId);
        return NextResponse.json({ success: true });
      }

      case "SUBMIT_INFLUENCE": {
        await BlameService.submitInfluence(code, {
          playerId,
          roundIndex: payload.roundIndex,
          influencedByPlayerId: payload.influencedByPlayerId,
          reason: payload.reason,
        });
        return NextResponse.json({ success: true });
      }

      case "SUBMIT_BLAME": {
        await BlameService.submitBlame(code, {
          accuserPlayerId: playerId,
          roundIndex: payload.roundIndex,
          blamedPlayerId: payload.blamedPlayerId,
        });
        return NextResponse.json({ success: true });
      }

      case "COMPILE_RECEIPTS": {
        const result = await BlameService.compileReceipts(code);
        return NextResponse.json({
          success: true,
          receipts: result?.receipts || null,
          missionResults: result?.missionResults || [],
        });
      }

      case "ACTIVATE_HOST_PASS": {
        await MonetizationService.activateRoomHostPass(code);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to execute action";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
