import nodemailer, { Transporter } from "nodemailer";

export interface SendMailResult {
  success: boolean;
  simulated?: boolean;
  reason?: string;
  error?: string;
}

export class MailerService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT) || 465;

    if (!host || !user || !pass) {
      return null;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    return this.transporter;
  }

  /**
   * Sends a styled CHAOS OTP verification email.
   */
  public static async sendOtpEmail(toEmail: string, otp: string): Promise<SendMailResult> {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || "smtp.hostinger.com";

    if (!user || !pass) {
      const missing = [];
      if (!user) missing.push("SMTP_USER");
      if (!pass) missing.push("SMTP_PASS");
      return {
        success: true,
        simulated: true,
        reason: `Missing server credentials: ${missing.join(", ")}`,
      };
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      return {
        success: true,
        simulated: true,
        reason: "Failed to initialize nodemailer transporter",
      };
    }

    // Hostinger policy: sender mailbox must match authenticated SMTP_USER (hey@smishventures.com)
    let fromAddress = `"CHAOS" <${user}>`;
    if (process.env.SMTP_FROM && process.env.SMTP_FROM.includes(user)) {
      fromAddress = process.env.SMTP_FROM;
    }

    const subject = `Your CHAOS Login Code: ${otp}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CHAOS Verification Code</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080210; color: #ffffff; margin: 0; padding: 24px 12px; }
            .container { max-width: 440px; margin: 0 auto; background: linear-gradient(180deg, #180A2E 0%, #0D041A 100%); border: 1px solid rgba(168,85,247,0.35); border-radius: 24px; padding: 32px 24px; text-align: center; box-shadow: 0 16px 48px rgba(0,0,0,0.7); }
            .logo-img { width: 140px; max-width: 100%; height: auto; display: block; margin: 0 auto; }
            .tagline-line1 { font-family: 'Arial Black', Impact, -apple-system, sans-serif; font-size: 19px; font-weight: 900; font-style: italic; color: #FFFFFF; letter-spacing: 0.5px; line-height: 1.15; text-transform: uppercase; margin-top: 12px; }
            .tagline-line2 { font-family: 'Arial Black', Impact, -apple-system, sans-serif; font-size: 19px; font-weight: 900; font-style: italic; color: #FFD23F; letter-spacing: 0.5px; line-height: 1.15; text-transform: uppercase; margin-top: 4px; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 10px; }
            .desc { font-size: 13px; color: #D8B4FE; line-height: 1.5; margin-bottom: 26px; }
            .code-box { background: rgba(0,0,0,0.65); border: 2px solid #FF0038; border-radius: 18px; padding: 16px 20px; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #FFD23F; display: inline-block; margin-bottom: 26px; box-shadow: 0 0 28px rgba(255,0,56,0.45); }
            .footer { font-size: 11px; color: #9CA3AF; line-height: 1.45; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px; }
          </style>
        </head>
        <body style="background-color: #080210; margin: 0; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div class="container" style="max-width: 440px; margin: 0 auto; background: linear-gradient(180deg, #180A2E 0%, #0D041A 100%); border: 1px solid rgba(168,85,247,0.35); border-radius: 24px; padding: 32px 20px; text-align: center; box-shadow: 0 16px 48px rgba(0,0,0,0.7);">
            
            <!-- Hero Logo -->
            <div style="text-align: center; margin-bottom: 12px;">
              <img 
                src="https://www.smishventures.com/Logo_Transparent.png" 
                alt="CHAOS" 
                width="140" 
                height="140" 
                style="width: 140px; max-width: 100%; height: auto; display: block; margin: 0 auto; border: 0;"
              />
            </div>

            <!-- Homepage 2-Line Tagline -->
            <div style="margin-bottom: 24px;">
              <div style="font-family: 'Arial Black', Impact, -apple-system, sans-serif; font-size: 19px; font-weight: 900; font-style: italic; color: #FFFFFF; letter-spacing: 0.5px; line-height: 1.15; text-transform: uppercase;">
                MAKE A DECISION.
              </div>
              <div style="font-family: 'Arial Black', Impact, -apple-system, sans-serif; font-size: 19px; font-weight: 900; font-style: italic; color: #FFD23F; letter-spacing: 0.5px; line-height: 1.15; text-transform: uppercase; margin-top: 4px;">
                DEAL WITH THE CHAOS.
              </div>
            </div>

            <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 10px; letter-spacing: -0.3px;">
              Your Secret Access Code
            </div>
            <div style="font-size: 13px; color: #D8B4FE; line-height: 1.5; margin-bottom: 26px; padding: 0 8px;">
              Enter this 6-digit one-time code to verify your account and sync your badges, scores, and host passes to the cloud.
            </div>

            <!-- Glowing Red OTP Box with Yellow Code -->
            <div style="background: rgba(0,0,0,0.65); border: 2px solid #FF0038; border-radius: 18px; padding: 16px 20px; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #FFD23F; display: inline-block; margin-bottom: 26px; box-shadow: 0 0 28px rgba(255,0,56,0.45);">
              ${otp}
            </div>

            <div style="font-size: 11px; color: #9CA3AF; line-height: 1.45; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px;">
              This verification code expires in <strong style="color: #FFFFFF;">10 minutes</strong>.<br>
              If you did not request this email, no changes have been made.
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        envelope: {
          from: user,
          to: toEmail,
        },
        to: toEmail,
        subject,
        html: htmlContent,
      });
      return { success: true, simulated: false, reason: `Sent: ${info.messageId}` };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("[CHAOS AUTH] Error sending email via SMTP:", err);
      return {
        success: true,
        simulated: true,
        reason: "SMTP_ERROR",
        error: errMsg,
      };
    }
  }
}
