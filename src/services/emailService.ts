import nodemailer from "nodemailer";

interface SendEmail {
  to: string;
  subject: string;
  text: string;
  html?:string
}

export const sendEmail = async ({ to, subject, text, html }: SendEmail) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html:html
  });
};
