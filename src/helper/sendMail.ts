import nodemailer from "nodemailer";
import { env } from "../config/envConfig";

export const sendMail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.USER_EMAIL,
        pass: env.USER_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App Name" <${env.USER_EMAIL}>`,
      to: email,
      subject: "Verify your email with OTP",
      text: `Hello! Your OTP is: ${otp}`,
      html: `<h1>Verify your email</h1><p>Your OTP: <b>${otp}</b></p>`,
    });

    console.log("Email sent:", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};
