import nodemailer from "nodemailer";
import { globalConfig } from "../models/db";

export interface MailConfig {
  smtpEnabled?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  fromEmail?: string;
  fromName?: string;
}

export function getMailConfig(): MailConfig {
  const config = (globalConfig as any)?.mailSettings || (globalConfig as any)?.smtp || {};
  return {
    smtpEnabled: config.smtpEnabled ?? Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    smtpHost: config.smtpHost || process.env.SMTP_HOST || "",
    smtpPort: Number(config.smtpPort || process.env.SMTP_PORT || 587),
    smtpUser: config.smtpUser || process.env.SMTP_USER || "",
    smtpPass: config.smtpPass || process.env.SMTP_PASS || "",
    smtpSecure: config.smtpSecure ?? (Number(config.smtpPort || process.env.SMTP_PORT) === 465),
    fromEmail: config.fromEmail || process.env.SMTP_FROM_EMAIL || config.smtpUser || "noreply@taxiapp.com",
    fromName: config.fromName || "TaxiApp Team",
  };
}

export async function sendSmtpEmail(
  to: string,
  subject: string,
  html: string,
  customConfig?: MailConfig
): Promise<{ success: boolean; message: string; log?: string }> {
  const config = customConfig || getMailConfig();

  if (!config.smtpHost || !config.smtpUser) {
    console.log(`[SMTP SIMULATED] To: ${to} | Subject: ${subject}`);
    return {
      success: true,
      message: `Simulated: Email logged to console (SMTP credentials not configured)`,
      log: `Simulated send to ${to}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort || 587,
      secure: config.smtpSecure ?? false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.fromName || 'TaxiApp'}" <${config.fromEmail || config.smtpUser}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      message: `Email successfully delivered to ${to}`,
      log: `Message ID: ${info.messageId}`,
    };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send email to ${to}:`, err.message);
    return {
      success: false,
      message: err.message || "Failed to send email via SMTP",
      log: err.stack,
    };
  }
}
