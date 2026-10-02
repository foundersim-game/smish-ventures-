import { PlayerSession } from "../types/player.types";
import { ChaosReportSummary, PlayerArchetypeTitle } from "../types/scoring.types";

export class TitlesAssigner {
  /**
   * Evaluates player session stats across all rounds and assigns unique archetype titles.
   */
  public static assignTitles(
    roomId: string,
    players: PlayerSession[],
    totalResourcesDestroyed: number
  ): ChaosReportSummary {
    const titles: Record<string, PlayerArchetypeTitle> = {};
    const scores: Record<string, number> = {};

    let totalDecisions = 0;
    let totalMindChanges = 0;

    let maxInfluenced = -1;
    let mostInfluentialPlayer = players[0];

    let maxMindChanges = -1;
    let theSheepPlayer = players[0];

    let minMindChanges = 999;
    let theWallPlayer = players[0];

    let maxBlamed = -1;
    let mostBlamedPlayer = players[0];

    for (const player of players) {
      scores[player.id] = player.stats.totalScore;
      totalDecisions += player.stats.decisionsMade;
      totalMindChanges += player.stats.mindChanges;

      if (player.stats.timesInfluencedOthers > maxInfluenced) {
        maxInfluenced = player.stats.timesInfluencedOthers;
        mostInfluentialPlayer = player;
      }

      if (player.stats.mindChanges > maxMindChanges) {
        maxMindChanges = player.stats.mindChanges;
        theSheepPlayer = player;
      }

      if (player.stats.mindChanges < minMindChanges) {
        minMindChanges = player.stats.mindChanges;
        theWallPlayer = player;
      }

      if (player.stats.timesBlamed > maxBlamed) {
        maxBlamed = player.stats.timesBlamed;
        mostBlamedPlayer = player;
      }
    }

    // Default assignment
    for (const p of players) {
      titles[p.id] = "THE DIPLOMAT";
    }

    if (mostInfluentialPlayer) {
      titles[mostInfluentialPlayer.id] = "THE MANIPULATOR";
    }
    if (theSheepPlayer && theSheepPlayer.id !== mostInfluentialPlayer?.id) {
      titles[theSheepPlayer.id] = "THE SHEEP";
    }
    if (theWallPlayer && theWallPlayer.id !== theSheepPlayer?.id) {
      titles[theWallPlayer.id] = "THE WALL";
    }
    if (mostBlamedPlayer) {
      if (mostBlamedPlayer.stats.timesInfluencedOthers === 0) {
        titles[mostBlamedPlayer.id] = "THE VICTIM";
      } else {
        titles[mostBlamedPlayer.id] = "THE MASTER OF DISASTER";
      }
    }

    return {
      roomId,
      totalPlayers: players.length,
      totalDecisions,
      totalMindChanges,
      totalResourcesDestroyed,
      mostInfluentialName: mostInfluentialPlayer ? mostInfluentialPlayer.name : "None",
      theWallName: theWallPlayer ? theWallPlayer.name : "None",
      theSheepName: theSheepPlayer ? theSheepPlayer.name : "None",
      mostBlamedName: mostBlamedPlayer ? mostBlamedPlayer.name : "None",
      playerTitles: titles,
      scores,
    };
  }
}
