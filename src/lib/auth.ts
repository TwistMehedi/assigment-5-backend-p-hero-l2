import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../generated/prisma";
import { emailOTP } from "better-auth/plugins";
import { sendMail } from "../helper/sendMail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    emailOTP({
      otpLength: 8,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          sendMail(email, otp);
        }
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.USER,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
    },
  },
});
