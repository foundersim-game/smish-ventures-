import { ScenarioResourceState, ChaosIntensity } from "../types/room.types";
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
    currentResourceState: ScenarioResourceState,
    intensity?: ChaosIntensity
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

    // Dynamic intensity multiplier gives Chaos Slider real gameplay impact
    const multiplier =
      intensity === "chill"
        ? 0.75
        : intensity === "spicy"
        ? 1.35
        : intensity === "insane"
        ? 1.75
        : 1.0;

    // Apply resource deltas
    if (consequence.resourceDelta) {
      if (typeof consequence.resourceDelta.balance === "number") {
        const delta =
          consequence.resourceDelta.balance < 0
            ? Math.round(consequence.resourceDelta.balance * multiplier)
            : consequence.resourceDelta.balance;
        const currentBal = updatedResourceState.balance ?? 0;
        updatedResourceState.balance = Math.max(0, currentBal + delta);
      }
      if (typeof consequence.resourceDelta.sanity === "number") {
        const delta =
          consequence.resourceDelta.sanity < 0
            ? Math.round(consequence.resourceDelta.sanity * multiplier)
            : consequence.resourceDelta.sanity;
        updatedResourceState.sanity = Math.max(
          0,
          Math.min(100, (updatedResourceState.sanity ?? 0) + delta)
        );
      }
      if (typeof consequence.resourceDelta.chaosScore === "number") {
        const delta = Math.round(consequence.resourceDelta.chaosScore * multiplier);
        updatedResourceState.chaosScore =
          (updatedResourceState.chaosScore ?? 0) + delta;
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
