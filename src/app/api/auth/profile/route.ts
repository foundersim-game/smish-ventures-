import { NextRequest, NextResponse } from "next/server";
import { ProfileStore } from "@/services/auth/profile-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email query parameter is required." },
        { status: 400 }
      );
    }

    const profile = await ProfileStore.get(email);
    return NextResponse.json({
      success: true,
      profile: profile || null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve profile";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, careerStats, passStatus } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid email is required to sync profile." },
        { status: 400 }
      );
    }

    const saved = await ProfileStore.save({
      email,
      name: typeof name === "string" ? name.trim() : "Player",
      avatar: avatar || "crown",
      careerStats,
      passStatus,
    });

    return NextResponse.json({
      success: true,
      profile: saved,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save profile";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
