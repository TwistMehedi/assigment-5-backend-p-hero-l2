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

    // console.log(session);

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "sign-in",
      },
    });

    // console.log(rrr);
    return data;
  } catch (error) {
    console.log("User created error", error);
    await prisma.user.delete({ where: { email } });
  }
};
