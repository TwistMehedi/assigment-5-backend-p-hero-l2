import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import { env } from "../config/envConfig";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { UserStatus } from "../generated/prisma";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies["better-auth.session_token"];

    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!sessionExists) {
        return next(
          new ErrorHandler("Session expired. Please login again", 401),
        );
      }

      const user = sessionExists.user;

      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.SUSPEND
      ) {
        return next(new ErrorHandler("Unauthorized! User not active", 401));
      }

      const now = new Date();
      const expiresAt = new Date(sessionExists.expiresAt);
      const createdAt = new Date(sessionExists.createdAt);

      const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

      if (percentRemaining < 20) {
        res.setHeader("X-Session-Refresh", "true");
      }

      req.user = {
        id: user.id,
        role: user.role,
        email: user.email,
      };

      return next();
    }

    // const token = req.cookies?.token;

    // if (!token) {
    //   return next(new ErrorHandler("Please login first", 401));
    // }

    // const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;

    // req.user = {
    //   id: decoded.id,
    //   role: decoded.role,
    //   email: decoded.email,
    // };

    return next();
  } catch (error) {
    console.log("❌ Auth Error:", error);

    return next(new ErrorHandler("Authentication failed", 401));
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role (${req.user.role}) not allowed`, 403));
    }

    next();
  };
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new ErrorHandler("No refresh token", 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
    });

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid refresh token", 401));
  }
};
