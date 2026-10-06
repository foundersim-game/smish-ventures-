import { NextResponse } from "next/server";
import { PurchaseVerificationService, VerifyPurchasePayload } from "../../../../backend/services/purchase-verification.service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body: VerifyPurchasePayload = await req.json();

    if (!body.transactionId || !body.productId) {
      return NextResponse.json(
        { success: false, error: "Missing transactionId or productId." },
        { status: 400 }
      );
    }

    const result = await PurchaseVerificationService.verifyAndAllocate(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Verification failed." },
        { status: 422 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("[API /api/purchases/verify] Exception:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error verifying purchase." },
      { status: 500 }
    );
  }
}
