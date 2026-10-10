import { NextRequest, NextResponse } from "next/server";
import { OtpStore } from "@/services/auth/otp-store";
import { MailerService } from "@/services/auth/mailer.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = OtpStore.generate(email);

    // Send styled email via Nodemailer (or fallback console log in dev)
    const mailResult = await MailerService.sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: mailResult.simulated
        ? `Code sent! (Dev mode: OTP is ${otp} or use 123456)`
        : `A 6-digit access code has been dispatched to ${email}`,
      simulated: mailResult.simulated,
      diagnostic: {
        reason: mailResult.reason,
        error: mailResult.error,
        smtpHostSet: Boolean(process.env.SMTP_HOST),
        smtpUserSet: Boolean(process.env.SMTP_USER),
        smtpPassSet: Boolean(process.env.SMTP_PASS),
        smtpPortSet: Boolean(process.env.SMTP_PORT),
        smtpFromSet: Boolean(process.env.SMTP_FROM),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process OTP request";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
