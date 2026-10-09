import { NextRequest, NextResponse } from "next/server";
import { OtpStore } from "@/services/auth/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, error: "Please enter the 6-digit code." },
        { status: 400 }
      );
    }

    const verification = OtpStore.verify(email, otp);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      message: "Successfully verified!",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify OTP";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
