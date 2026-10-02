import { NextResponse } from "next/server";
import { RoomService } from "../../../backend/services/room.service";
import { ScenarioRegistry } from "../../../backend/data/scenarios";
import { MonetizationService } from "../../../backend/services/monetization.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostName, hostAvatar, mode, scenarioId, settings, isPaidSession } = body;

    const result = await RoomService.createRoom({
      hostName,
      hostAvatar,
      mode,
      scenarioId,
      settings,
      isPaidSession,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create room";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  const scenarios = ScenarioRegistry.getAll();
  const pricingTiers = MonetizationService.getPricingTiers();
  return NextResponse.json({ scenarios, pricingTiers });
}
