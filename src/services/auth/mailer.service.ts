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

    const fromAddress = process.env.SMTP_FROM || `"CHAOS Party Game" <${user}>`;
    const subject = `Your CHAOS Login Code: ${otp}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080210; color: #ffffff; margin: 0; padding: 24px; }
            .container { max-width: 480px; margin: 0 auto; background: linear-gradient(180deg, #180A2E 0%, #0D041A 100%); border: 1px solid rgba(168,85,247,0.3); border-radius: 24px; padding: 32px 24px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
            .logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #FF3B8A; margin-bottom: 8px; }
            .tagline { font-size: 13px; color: #D8B4FE; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 12px; }
            .desc { font-size: 14px; color: #9CA3AF; line-height: 1.5; margin-bottom: 28px; }
            .code-box { background: rgba(0,0,0,0.6); border: 2px solid #FF0038; border-radius: 16px; padding: 18px 24px; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #FFD23F; display: inline-block; margin-bottom: 28px; box-shadow: 0 0 25px rgba(255,0,56,0.4); }
            .footer { font-size: 11px; color: #6B7280; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚡ CHAOS</div>
            <div class="tagline">Make a Decision. Deal with the Chaos.</div>
            <div class="title">Your Secret Access Code</div>
            <div class="desc">Enter this 6-digit one-time code to verify your account and sync your badges, scores, and host passes to the cloud.</div>
            <div class="code-box">${otp}</div>
            <div class="footer">
              This verification code expires in <strong>10 minutes</strong>.<br>
              If you did not request this email, no changes have been made.
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
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
