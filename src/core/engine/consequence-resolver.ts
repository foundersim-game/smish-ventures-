import { ScenarioResourceState } from "../types/room.types";
import { ScenarioConsequence, ScenarioRound } from "../types/scenario.types";
import { RoundVoteResolution } from "../types/vote.types";

export interface ResolvedConsequenceOutcome {
  consequence: ScenarioConsequence;
  updatedResourceState: ScenarioResourceState;
  isChaosMoment: boolean;
  chaosMomentMessage: string | null;
}

export class ConsequenceResolver {
  /**
   * Resolves the scenario consequence based on winning option and current resource state.
   */
  public static resolve(
    currentRound: ScenarioRound,
    resolution: RoundVoteResolution,
    currentResourceState: ScenarioResourceState
  ): ResolvedConsequenceOutcome {
    const winningId = resolution.winningOptionId;
    const consequence = currentRound.consequences[winningId] || {
      title: "CONSEQUENCE",
      narrative: "The group made their choice. Now deal with it.",
    };

    const updatedResourceState: ScenarioResourceState = {
      ...currentResourceState,
      ...(typeof currentResourceState.balance === "number"
        ? { balance: currentResourceState.balance }
        : {}),
      sanity: currentResourceState.sanity ?? 100,
      chaosScore: currentResourceState.chaosScore ?? 0,
    };

    // Apply resource deltas
    if (consequence.resourceDelta) {
      if (typeof consequence.resourceDelta.balance === "number") {
        const currentBal = updatedResourceState.balance ?? 0;
        updatedResourceState.balance = Math.max(
          0,
          currentBal + consequence.resourceDelta.balance
        );
      }
      if (typeof consequence.resourceDelta.sanity === "number") {
        updatedResourceState.sanity = Math.max(
          0,
          Math.min(100, (updatedResourceState.sanity ?? 0) + consequence.resourceDelta.sanity)
        );
      }
      if (typeof consequence.resourceDelta.chaosScore === "number") {
        updatedResourceState.chaosScore =
          (updatedResourceState.chaosScore ?? 0) + consequence.resourceDelta.chaosScore;
      }
    }

    // Check for CHAOS moments (100% mind change or absurd consequence or explicit flag)
    let isChaosMoment = Boolean(consequence.triggerChaosMoment || consequence.isAbsurd);
    let chaosMomentMessage = consequence.chaosMomentMessage || null;

    if (resolution.totalVotes > 3 && resolution.switchedPlayerCount === resolution.totalVotes) {
      isChaosMoment = true;
      chaosMomentMessage = "TOTAL CHAOS! 100% OF THE ROOM FLIPPED THEIR VOTE!";
    }

    return {
      consequence,
      updatedResourceState,
      isChaosMoment,
      chaosMomentMessage,
    };
  }
}
