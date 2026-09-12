import nodemailer from "nodemailer";
import { globalConfig } from "../models/db";

export interface MailConfig {
  mailProvider: "smtp" | "none";
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  smtpSenderName: string;
  smtpEnabled: boolean;
}

export function getMailConfig(): MailConfig {
  const defaultMailSettings: MailConfig = {
    mailProvider: "smtp",
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "no-reply@example.com",
    smtpSenderName: "TaxiApp Support",
    smtpEnabled: false
  };

  const currentSettings = globalConfig?.mailSettings || {};
  return {
    ...defaultMailSettings,
    ...currentSettings
  };
}

/**
 * Sends an email using SMTP (nodemailer)
 */
export async function sendSmtpEmail(
  to: string,
  subject: string,
  htmlContent: string,
  customConfig?: MailConfig
): Promise<{ success: boolean; message: string; log?: string }> {
  const config = customConfig || getMailConfig();

  if (!config.smtpHost || !config.smtpUser) {
    return {
      success: false,
      message: "SMTP is not fully configured. Please fill Host, User, and Password in Mail Settings.",
      log: "Missing SMTP configuration values."
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: config.smtpSecure, // true for port 465, false for other ports
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL issues with self-signed certs
      }
    });

    const info = await transporter.sendMail({
      from: `"${config.smtpSenderName}" <${config.smtpFrom || config.smtpUser}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log(`[SMTP EMAIL SENT] Message ID: ${info.messageId} to ${to}`);
    return {
      success: true,
      message: `Email sent successfully. Message ID: ${info.messageId}`,
      log: JSON.stringify(info)
    };
  } catch (error: any) {
    console.error("[SMTP EMAIL ERROR]", error);
    return {
      success: false,
      message: error.message || "Failed to send SMTP email.",
      log: error.stack || String(error)
    };
  }
}

