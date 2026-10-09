interface StoredOtp {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const globalForOtp = global as unknown as {
  chaosOtpStore?: Map<string, StoredOtp>;
};

if (!globalForOtp.chaosOtpStore) {
  globalForOtp.chaosOtpStore = new Map<string, StoredOtp>();
}

export class OtpStore {
  private static store = globalForOtp.chaosOtpStore!;

  /**
   * Generates and saves a 6-digit OTP code valid for 10 minutes.
   */
  public static generate(email: string): string {
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.store.set(cleanEmail, {
      otp,
      expiresAt,
      attempts: 0,
    });

    return otp;
  }

  /**
   * Validates a provided OTP code against stored records.
   */
  public static verify(email: string, candidateOtp: string): { valid: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCandidate = candidateOtp.trim();

    // Development bypass for instant local testing
    if (process.env.NODE_ENV !== "production" && cleanCandidate === "123456") {
      return { valid: true };
    }

    const record = this.store.get(cleanEmail);
    if (!record) {
      return { valid: false, error: "No verification code was requested for this email." };
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(cleanEmail);
      return { valid: false, error: "Verification code has expired. Please request a new one." };
    }

    if (record.attempts >= 5) {
      this.store.delete(cleanEmail);
      return { valid: false, error: "Too many failed attempts. Please request a new code." };
    }

    if (record.otp !== cleanCandidate) {
      record.attempts += 1;
      return { valid: false, error: `Invalid code. ${5 - record.attempts} attempts remaining.` };
    }

    // Success: consume OTP so it cannot be re-used
    this.store.delete(cleanEmail);
    return { valid: true };
  }
}
