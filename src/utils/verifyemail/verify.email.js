import { EventEmitter } from "node:events";
import { sendMail } from "../sendemail.js";
import { verifyEmailTemplates } from "../templates/verify.email.templates.js";

export const emailEvent = new EventEmitter();

emailEvent.on("Confirm Email", async (data) => {
  try {
    await sendMail({
      to: data.to,
      subject: data.subject || "Confirm Your Email",
      html: verifyEmailTemplates({ otp: data.otp }),
    });
    console.log(`Email sent successfully to ${data.to}`);
  } catch (error) {
    console.error(`Failed to send email to ${data.to}:`, error);
  }
});

emailEvent.on("SendForgotPassword", async (data) => {
  try {
    await sendMail({
      to: data.to,
      subject: data.subject || "Forgot OTP",
      html: verifyEmailTemplates({ otp: data.otp, title: data.title }),
    });
    console.log(`Email sent successfully to ${data.to}`);
  } catch (error) {
    console.error(`Failed to send email to ${data.to}:`, error);
  }
});
