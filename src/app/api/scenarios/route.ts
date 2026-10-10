import { NextResponse } from "next/server";
import { ScenarioRegistry } from "../../../backend/data/scenarios";
import { ScenarioDefinition } from "../../../core/types/scenario.types";
import { getSupabaseClient } from "../../../services/supabase/supabase-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/scenarios
 * Returns all scenarios (built-in + weekly dynamic drops from database).
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("scenarios")
      .select("id, data, is_active, release_week")
      .eq("is_active", true)
      .order("release_week", { ascending: false });

    if (!error && Array.isArray(data)) {
      const dynamicList = data
        .map((row) => {
          if (!row.data) return null;
          const sc = { ...row.data } as ScenarioDefinition;
          if (row.release_week !== undefined && !sc.releaseWeek) {
            sc.releaseWeek = row.release_week;
          }
          if (sc.isNew === undefined) {
            sc.isNew = true;
          }
          return sc;
        })
        .filter(Boolean) as ScenarioDefinition[];

      if (dynamicList.length > 0) {
        ScenarioRegistry.registerDynamic(dynamicList);
      }
    }
  } catch (err) {
    console.debug("Database scenarios sync skipped (offline or table missing):", err);
  }

  const allScenarios = ScenarioRegistry.getAll();

  return NextResponse.json(
    {
      success: true,
      scenarios: allScenarios,
      count: allScenarios.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

/**
 * POST /api/scenarios
 * Authoritative admin endpoint to publish weekly scenarios without app updates.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenario, adminKey } = body;

    const expectedKey = process.env.ADMIN_SECRET_KEY || "chaos_admin_2026";
    const headerKey = req.headers.get("x-admin-key");

    if (adminKey !== expectedKey && headerKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Provide valid adminKey." },
        { status: 401 }
      );
    }

    if (!scenario || !scenario.id || !scenario.title || !Array.isArray(scenario.rounds)) {
      return NextResponse.json(
        { success: false, error: "Invalid scenario payload. Requires id, title, and rounds array." },
        { status: 400 }
      );
    }

    // Default to newly added
    if (scenario.isNew === undefined) {
      scenario.isNew = true;
    }

    // 1. Register in memory
    ScenarioRegistry.registerDynamic([scenario as ScenarioDefinition]);

    // 2. Persist to Supabase if configured
    try {
      const supabase = getSupabaseClient();
      await supabase.from("scenarios").upsert({
        id: scenario.id,
        title: scenario.title,
        category: scenario.category || "friends",
        data: scenario,
        release_week: scenario.releaseWeek || 999,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Could not persist scenario to database:", dbErr);
    }

    return NextResponse.json({
      success: true,
      scenarioId: scenario.id,
      message: `Scenario '${scenario.title}' published successfully! Playable by all clients.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish scenario";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
