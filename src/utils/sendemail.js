import nodemailer from "nodemailer";

export async function sendMail({
  from = `${process.env.Account_Google}`,
  to = "",
  cc = "",
  bcc = "",
  text = "",
  html = "",
  subject = "Saraha App",
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Account_Google,
      pass: process.env.Password_Google,
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${from}>`,
    to,
    cc,
    bcc,
    text,
    html,
    attachments,
  });
}
