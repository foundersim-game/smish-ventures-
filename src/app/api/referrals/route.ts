import { NextResponse } from "next/server";
import { ReferralService } from "../../../backend/services/referral.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const refToken = searchParams.get("refToken") || "";
    const roomCode = searchParams.get("roomCode") || "";
    const hostPlayerId = searchParams.get("hostPlayerId") || "";

    if (roomCode && hostPlayerId) {
      const attribution = ReferralService.getOrCreateReferralToken(roomCode, hostPlayerId);
      return NextResponse.json({
        success: true,
        attribution,
      });
    }

    if (refToken || roomCode) {
      const status = ReferralService.getLiveStatus(refToken || roomCode);
      return NextResponse.json({
        success: true,
        status,
      });
    }

    return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Referral error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refToken, roomCode, joiningPlayerId, visitorFingerprint } = body;

    if (!roomCode || !joiningPlayerId || !visitorFingerprint) {
      return NextResponse.json(
        { success: false, error: "Missing required tracking attributes" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;

    const result = await ReferralService.recordVerifiedJoin({
      refToken,
      roomCode,
      joiningPlayerId,
      visitorFingerprint,
      visitorIp: ip,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Tracking error" },
      { status: 500 }
    );
  }
}
