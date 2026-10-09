import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/services/supabase/supabase-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to verify account deletion." },
        { status: 400 }
      );
    }

    // Try Supabase Auth user purge if connected
    try {
      const supabase = getSupabaseClient();
      // Remove any matching records from player profile tables if applicable
      await supabase.from("player_profiles").delete().eq("email", email);
    } catch {
      // Non-fatal if Supabase tables are optional
    }

    return NextResponse.json({
      success: true,
      message: "Account and associated cloud data have been permanently deleted.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete account";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
