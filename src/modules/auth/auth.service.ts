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
    await prisma.user.delete({ where: { email } });
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

    const update = await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    return { update, session };
  } catch (error) {
    console.log("error", error);
    throw new ErrorHandler("Invalid your OTP", 400);
  }
};
