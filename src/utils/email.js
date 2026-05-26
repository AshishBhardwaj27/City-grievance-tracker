import nodemailer from "nodemailer";

import logger from "./logger.js";


// ───────────────────────────────────────────────────────
// Create Email Transporter
// ───────────────────────────────────────────────────────

const createTransporter = () => {

  return nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: process.env.SMTP_PORT,

    secure:
      process.env.SMTP_PORT === "465",

    auth: {
      user: process.env.SMTP_USER,

      pass: process.env.SMTP_PASS,
    },
  });
};


// ───────────────────────────────────────────────────────
// Send Email
// ───────────────────────────────────────────────────────

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {

  try {

    const transporter =
      createTransporter();


    const info =
      await transporter.sendMail({

        from:
          `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,

        to,

        subject,

        html,

        text,
      });


    logger.info(
      `Email sent to ${to}: ${info.messageId}`
    );


    return info;

  } catch (error) {

    logger.error(
      "Email send failed:",
      error
    );

    throw error;
  }
};


// ───────────────────────────────────────────────────────
// Email Templates
// ───────────────────────────────────────────────────────

const emailTemplates = {

  // ─── Email Verification ─────────────────────────────

  verification: (
    name,
    token,
    url
  ) => ({

    subject:
      "🎪 Verify Your Circus of Wonders Account",

    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f13;color:#fff;padding:40px;border-radius:12px;">

        <h1 style="color:#f59e0b;">
          🎪 Circus of Wonders
        </h1>

        <h2>
          Welcome, ${name}!
        </h2>

        <p>
          Please verify your account to start submitting complaints and tracking their resolution.
        </p>

        <a
          href="${url}/auth/verify/${token}"
          style="display:inline-block;background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;"
        >
          Verify Account
        </a>

        <p style="color:#666;font-size:12px;">
          Link expires in 24 hours.
          If you did not sign up, ignore this email.
        </p>

      </div>
    `,
  }),


  // ─── Password Reset ─────────────────────────────────

  passwordReset: (
    name,
    token,
    url
  ) => ({

    subject:
      "🔐 Reset Your Password — Circus of Wonders",

    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f13;color:#fff;padding:40px;border-radius:12px;">

        <h1 style="color:#f59e0b;">
          🎪 Circus of Wonders
        </h1>

        <h2>
          Password Reset Request
        </h2>

        <p>
          Hello ${name},
          we received a request to reset your password.
        </p>

        <a
          href="${url}/auth/reset-password/${token}"
          style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;"
        >
          Reset Password
        </a>

        <p style="color:#666;font-size:12px;">
          Link expires in 1 hour.
          If you did not request this,
          please secure your account.
        </p>

      </div>
    `,
  }),


  // ─── Complaint Status Update ────────────────────────

  statusUpdate: (
    name,
    ticketId,
    status,
    note
  ) => ({

    subject:
      `📋 Complaint ${ticketId} — Status Updated to ${status}`,

    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f13;color:#fff;padding:40px;border-radius:12px;">

        <h1 style="color:#f59e0b;">
          🎪 Circus of Wonders
        </h1>

        <h2>
          Complaint Update
        </h2>

        <p>
          Hello ${name},
          your complaint
          <strong>${ticketId}</strong>
          has been updated.
        </p>

        <p>
          New Status:
          <strong style="color:#f59e0b;">
            ${status}
          </strong>
        </p>

        ${
          note
            ? `<p>Note: ${note}</p>`
            : ""
        }

        <p style="color:#666;font-size:12px;">
          Log in to your portal to view full details.
        </p>

      </div>
    `,
  }),
};


export {
  sendEmail,
  emailTemplates,
};