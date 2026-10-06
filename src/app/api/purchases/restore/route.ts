import { NextResponse } from "next/server";
import { PurchaseVerificationService } from "../../../../backend/services/purchase-verification.service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, playerId } = body;

    if (!deviceId && !playerId) {
      return NextResponse.json(
        { success: false, error: "Missing deviceId or playerId for restoration." },
        { status: 400 }
      );
    }

    const { activePurchases, hasActivePass } =
      await PurchaseVerificationService.restorePurchasesForDevice(
        deviceId || "",
        playerId
      );

    return NextResponse.json(
      {
        success: true,
        restored: hasActivePass,
        activePurchases,
        message: hasActivePass
          ? `Successfully restored ${activePurchases.length} previous purchase(s).`
          : "No previous active purchases found for this account.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API /api/purchases/restore] Exception:", err);
    return NextResponse.json(
      { success: false, error: "Failed to query purchase ledger." },
      { status: 500 }
    );
  }
}
