import { ScenarioDefinition } from "../../../core/types/scenario.types";
import { GameMode } from "../../../core/types/room.types";
import { NIGHT_OUT_SCENARIO } from "./night-out.scenario";
import { QUICK_CHAOS_SCENARIO } from "./quick-chaos.scenario";
import { TRUTH_OR_CHAOS_SCENARIO } from "./truth-or-chaos.scenario";
import { HOT_TAKES_SCENARIO } from "./hot-takes.scenario";
import { COUPLES_PACK_SCENARIO } from "./couples-pack.scenario";
import { COUPLES_WHO_KNOWS_WHO_SCENARIO } from "./couples-who-knows-who.scenario";
import { COUPLES_AFTER_DARK_SCENARIO } from "./couples-after-dark.scenario";
import { COUPLES_FUTURE_SCENARIO } from "./couples-future.scenario";
import { TRAVEL_SCENARIO } from "./travel.scenario";
import { GOA_SCENARIO } from "./goa.scenario";
import { COLLEGE_SCENARIO } from "./college.scenario";
import { ABSURD_SCENARIO } from "./absurd.scenario";
import { WEDDING_SCENARIO } from "./wedding.scenario";
import { STARTUP_SCENARIO } from "./startup.scenario";
import { ASPEN_SCENARIO } from "./aspen.scenario";
import { LAKE_HOUSE_SCENARIO } from "./lake-house.scenario";

export const SCENARIO_CATALOG: ScenarioDefinition[] = [
  // Party Mode Flagship Packs (4-10 players, 8-10 connected rounds each)
  QUICK_CHAOS_SCENARIO,
  NIGHT_OUT_SCENARIO,
  ABSURD_SCENARIO,
  TRAVEL_SCENARIO,
  STARTUP_SCENARIO,
  ASPEN_SCENARIO,
  LAKE_HOUSE_SCENARIO,
  GOA_SCENARIO,
  COLLEGE_SCENARIO,
  WEDDING_SCENARIO,
  // Couples Mode Packs (Dedicated 2 players - Coming Soon)
  COUPLES_PACK_SCENARIO,
  COUPLES_WHO_KNOWS_WHO_SCENARIO,
  COUPLES_AFTER_DARK_SCENARIO,
  COUPLES_FUTURE_SCENARIO,
];

export class ScenarioRegistry {
  public static getAll(): ScenarioDefinition[] {
    return SCENARIO_CATALOG;
  }

  public static getById(id: string): ScenarioDefinition | undefined {
    return SCENARIO_CATALOG.find((s) => s.id === id);
  }

  public static getByCategory(category: string): ScenarioDefinition[] {
    return SCENARIO_CATALOG.filter((s) => s.category === category);
  }

  /**
   * Retrieves scenarios filtered strictly by GameMode (party vs couples)
   * and optionally by monetization tier (free vs premium).
   */
  public static getScenariosForMode(
    mode: GameMode,
    tier?: "free" | "premium"
  ): ScenarioDefinition[] {
    const isCouples = mode === "couples";
    return SCENARIO_CATALOG.filter((s) => {
      const matchesMode = isCouples ? s.category === "couples" : s.category !== "couples";
      if (!matchesMode) return false;
      if (tier === "free") return !s.isPremium;
      if (tier === "premium") return s.isPremium;
      return true;
    });
  }

  public static getFreeScenarios(): ScenarioDefinition[] {
    return SCENARIO_CATALOG.filter((s) => !s.isPremium && s.category !== "couples");
  }

  public static getPremiumScenarios(): ScenarioDefinition[] {
    return SCENARIO_CATALOG.filter((s) => s.isPremium);
  }

  public static getDefaultPartyScenario(): ScenarioDefinition {
    return QUICK_CHAOS_SCENARIO;
  }

  public static getDefaultCouplesScenario(): ScenarioDefinition {
    return COUPLES_PACK_SCENARIO;
  }

  public static getDefaultScenarioForMode(mode: GameMode): ScenarioDefinition {
    return mode === "couples" ? COUPLES_PACK_SCENARIO : QUICK_CHAOS_SCENARIO;
  }
}

