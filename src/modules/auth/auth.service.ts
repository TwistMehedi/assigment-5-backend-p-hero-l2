import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/errorHandler";
import { Request as ExpressRequest } from "express";
import { IUser } from "./auth.interface";

export const registerService = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role,
      },
    });

    if (!data.user) {
      throw new ErrorHandler("User not created", 400);
    }

    // const session = await prisma.session.findFirst({
    //   where: {
    //     userId: data.user.id,
    //   },
    // });

    // console.log(session);
    // if (!session) {
    //   throw new ErrorHandler("sessionnot found", 400);
    // }

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "sign-in",
      },
    });

    return data;
  } catch (error: any) {
    console.log("User created error", error);

    try {
      await prisma.user.delete({ where: { email } });
    } catch (err: any) {
      console.log("Rollback failed", err);
      throw new ErrorHandler(err.message, 500);
    }
    throw new ErrorHandler(error.message, 500);
  }
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

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

    return { confirmUser };
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

    console.log("data");
    const data = await auth.api.signInEmail({
      body: {
        email: user.email,
        password,
        rememberMe: true,
      },
    });

    console.log(data);
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
  sessionToken: string,
) => {
  const { newPassword, currentPassword } = payload;

  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session || !session.user) {
    throw new ErrorHandler("Session not found", 404);
  }

  // console.log("session eeeeee", session); // akhane cookie log korle ata ase
  const data = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  console.log("data", data);

  return data;
};
