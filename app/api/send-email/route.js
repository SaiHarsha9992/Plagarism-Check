// /app/api/send-email/route.js (or .ts if using TypeScript)
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gaduharsha72@gmail.com',
      pass: process.env.NODEMAILER_APP_PASSWORD, // Use App Password if 2FA is on
    },
  });

  await transporter.sendMail({
    from: 'clonecatcher@gmail.com',
    to,
    subject,
    text: message,
  });

  return new Response(JSON.stringify({ success: true }));
}
