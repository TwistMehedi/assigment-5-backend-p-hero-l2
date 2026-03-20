import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../generated/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendMail } from "../helper/sendMail";

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
        defaultValue: UserRole.USER,
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
