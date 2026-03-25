import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendMail } from "../helper/sendMail";
import { Role, UserStatus } from "../generated/prisma";
import { emailMessage, forgotMessage } from "../helper/mailText";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    bearer(),
    emailOTP({
      otpLength: 8,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        // console.log("OTP Type Received:", type);
        if (type === "sign-in") {
          await sendMail(email, otp, emailMessage);
        } else if (type === "forget-password") {
          await sendMail(email, otp, forgotMessage);
        }
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
    },
  },

  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "lax", // ✅ change
          secure: false, // ✅ change
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: "lax", // ✅ change
          secure: false, // ✅ change
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});
