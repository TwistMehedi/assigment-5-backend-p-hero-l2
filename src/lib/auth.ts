import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendMail } from "../helper/sendMail";
import { Role, UserStatus } from "../generated/prisma";
import { emailMessage, forgotMessage } from "../helper/mailText";
import { env } from "../config/envConfig";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    env.CLIENT_URL,
    "http://localhost:3000",
    // "https://silver-space-journey-5j45pjw55j3xqv-3000.app.github.dev",
  ],

  plugins: [
    bearer(),
    emailOTP({
      otpLength: 8,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
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

      hasPassword: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

  advanced: {
    useSecureCookies: true,
    cookies: {
      state: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
  },

  socialProviders: {
    google: {
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      redirectUri: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
});
