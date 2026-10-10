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

const globalForScenarios = global as unknown as {
  chaosDynamicScenarios?: Map<string, ScenarioDefinition>;
};

export class ScenarioRegistry {
  private static get dynamicStore(): Map<string, ScenarioDefinition> {
    if (!globalForScenarios.chaosDynamicScenarios) {
      globalForScenarios.chaosDynamicScenarios = new Map<string, ScenarioDefinition>();
    }
    return globalForScenarios.chaosDynamicScenarios;
  }

  /**
   * Registers dynamic scenarios fetched remotely (e.g. weekly database drops).
   */
  public static registerDynamic(scenarios: ScenarioDefinition[]): void {
    for (const s of scenarios) {
      if (s && s.id) {
        if (s.isNew === undefined) {
          s.isNew = true;
        }
        s.isDynamic = true;
        this.dynamicStore.set(s.id, s);
      }
    }
  }

  /**
   * Retrieves all available scenarios (static catalog + weekly dynamic drops).
   * Dynamic / Newly added drops appear at the beginning of the list.
   */
  public static getAll(): ScenarioDefinition[] {
    const list = [...SCENARIO_CATALOG];
    for (const [id, dyn] of this.dynamicStore.entries()) {
      const idx = list.findIndex((s) => s.id === id);
      if (idx >= 0) {
        list[idx] = dyn;
      } else {
        list.unshift(dyn);
      }
    }
    return list;
  }

  public static getById(id: string): ScenarioDefinition | undefined {
    return this.dynamicStore.get(id) || SCENARIO_CATALOG.find((s) => s.id === id);
  }

  public static getByCategory(category: string): ScenarioDefinition[] {
    return this.getAll().filter((s) => s.category === category);
  }

  /**
   * Retrieves scenarios filtered strictly by GameMode (party vs couples)
   * and optionally by monetization tier (free vs premium).
   * Automatically sorts Newly Added (isNew / dynamic drops) to the top!
   */
  public static getScenariosForMode(
    mode: GameMode,
    tier?: "free" | "premium"
  ): ScenarioDefinition[] {
    const isCouples = mode === "couples";
    const filtered = this.getAll().filter((s) => {
      const matchesMode = isCouples ? s.category === "couples" : s.category !== "couples";
      if (!matchesMode) return false;
      if (tier === "free") return !s.isPremium;
      if (tier === "premium") return s.isPremium;
      return true;
    });

    // Bring Newly Added & New Drops to the top
    return filtered.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      if ((b.releaseWeek || 0) !== (a.releaseWeek || 0)) {
        return (b.releaseWeek || 0) - (a.releaseWeek || 0);
      }
      return 0;
    });
  }

  public static getFreeScenarios(): ScenarioDefinition[] {
    return this.getAll().filter((s) => !s.isPremium && s.category !== "couples");
  }

  public static getPremiumScenarios(): ScenarioDefinition[] {
    return this.getAll().filter((s) => s.isPremium);
  }

  public static getDefaultPartyScenario(): ScenarioDefinition {
    return this.getById("quick_chaos") || QUICK_CHAOS_SCENARIO;
  }

  public static getDefaultCouplesScenario(): ScenarioDefinition {
    return this.getById("couples_pack") || COUPLES_PACK_SCENARIO;
  }

  public static getDefaultScenarioForMode(mode: GameMode): ScenarioDefinition {
    return mode === "couples" ? this.getDefaultCouplesScenario() : this.getDefaultPartyScenario();
  }
}

