import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/errorHandler";
import { IUser } from "./auth.interface";

export const registerService = async (payload: IUser) => {
  const { name, email, password } = payload;
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!data.user) {
      throw new ErrorHandler("User not created", 400);
    }

    const session = await prisma.session.findFirst({
      where: {
        userId: data.user.id,
      },
    });

    if (!session) {
      throw new ErrorHandler("User not created", 400);
    }

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "sign-in",
      },
    });

    return data;
  } catch (error) {
    console.log("User created error", error);

    try {
      await prisma.user.delete({ where: { email } });
    } catch (err) {
      console.log("Rollback failed", err);
    }

    throw new ErrorHandler("Registration failed", 500);
  }
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const session = await prisma.session.findFirstOrThrow({
      where: {
        userId: user.id,
      },
    });

    const data = await auth.api.checkVerificationOTP({
      body: {
        email: user.email,
        type: "sign-in",
        otp,
      },
    });

    if (data.success !== true) throw new ErrorHandler("Invalid your OTP", 400);

    const confirmUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    return { confirmUser, session };
  } catch (error) {
    console.log("OTP error", error);

    if (error instanceof ErrorHandler) {
      throw error;
    }

    throw new ErrorHandler("OTP verification failed", 500);
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const data = await auth.api.signInEmail({
      body: {
        email: user.email,
        password,
        rememberMe: true,
        callbackURL: "https://example.com/callback",
      },
    });

    return data;
  } catch (error) {
    console.log("login error", error);

    throw new ErrorHandler("Invalid email or password", 400);
  }
};

export const passwordChange = async (
  payload: {
    newPassword: string;
    currentPassword: string;
  },
  id: string,
) => {
  const { newPassword, currentPassword } = payload;

  if (newPassword.length < 6) {
    throw new ErrorHandler("Password must be at least 6 characters", 400);
  }

  if (newPassword === currentPassword) {
    throw new ErrorHandler("New password cannot be same as old password", 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    const session = await prisma.session.findFirst({
      where: { userId: id },
    });

    if (!session) {
      throw new ErrorHandler("Session expired, please login again", 401);
    }

    const data = await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
    });

    if (!data) {
      throw new ErrorHandler("Password change failed", 400);
    }

    return data;
  } catch (error: any) {
    console.log("Password change error:", error);

    if (error instanceof ErrorHandler) {
      throw error;
    }
    throw new ErrorHandler("Something went wrong", 500);
  }
};
