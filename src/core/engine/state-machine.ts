import { GamePhase, RoomSession } from "../types/room.types";

export class GameStateMachine {
  private static readonly VALID_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
    lobby: ["initial_vote"],
    initial_vote: ["discussion", "final_vote"],
    discussion: ["final_vote"],
    final_vote: [
      "reveal_beat_1",
      "reveal_beat_2",
      "reveal_beat_3",
      "reveal_beat_4",
      "reveal_beat_5",
      "reveal_beat_6",
      "consequence",
    ],
    reveal_beat_1: [
      "reveal_beat_2",
      "reveal_beat_3",
      "reveal_beat_4",
      "reveal_beat_5",
      "reveal_beat_6",
      "consequence",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    reveal_beat_2: [
      "reveal_beat_1",
      "reveal_beat_3",
      "reveal_beat_4",
      "reveal_beat_5",
      "reveal_beat_6",
      "consequence",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    reveal_beat_3: [
      "reveal_beat_1",
      "reveal_beat_2",
      "reveal_beat_4",
      "reveal_beat_5",
      "reveal_beat_6",
      "consequence",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    reveal_beat_4: [
      "reveal_beat_1",
      "reveal_beat_2",
      "reveal_beat_3",
      "reveal_beat_5",
      "reveal_beat_6",
      "consequence",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    reveal_beat_5: [
      "reveal_beat_1",
      "reveal_beat_2",
      "reveal_beat_3",
      "reveal_beat_4",
      "reveal_beat_6",
      "consequence",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    reveal_beat_6: [
      "reveal_beat_1",
      "reveal_beat_2",
      "reveal_beat_3",
      "reveal_beat_4",
      "reveal_beat_5",
      "influence",
      "consequence",
      "blame",
      "round_wrap",
      "initial_vote",
      "chaos_report",
      "lobby",
    ],
    influence: ["consequence", "blame", "round_wrap", "initial_vote", "chaos_report", "lobby"],
    consequence: ["influence", "blame", "round_wrap", "initial_vote", "chaos_report", "lobby"],
    blame: ["consequence", "round_wrap", "initial_vote", "chaos_report", "lobby"],
    round_wrap: ["initial_vote", "chaos_report", "lobby"],
    chaos_report: ["lobby", "initial_vote"],
  };

  /**
   * Asserts whether a transition from current phase to target phase is permitted.
   */
  public static canTransition(currentPhase: GamePhase, targetPhase: GamePhase): boolean {
    if (currentPhase === targetPhase) return true;

    // Any reveal beat can freely transition to any other reveal beat
    if (currentPhase.startsWith("reveal_beat_") && targetPhase.startsWith("reveal_beat_")) {
      return true;
    }

    const allowed = this.VALID_TRANSITIONS[currentPhase];
    return allowed ? allowed.includes(targetPhase) : false;
  }

  /**
   * Applies the state transition to the room session and updates timestamps.
   */
  public static transition(
    room: RoomSession,
    targetPhase: GamePhase,
    durationSeconds = 0
  ): RoomSession {
    if (!this.canTransition(room.phase, targetPhase)) {
      throw new Error(
        `Invalid game phase transition requested: cannot transition from '${room.phase}' to '${targetPhase}'.`
      );
    }

    const now = Date.now();
    return {
      ...room,
      phase: targetPhase,
      phaseStartTimestamp: now,
      phaseDurationSeconds: durationSeconds,
      updatedAt: now,
    };
  }
}
