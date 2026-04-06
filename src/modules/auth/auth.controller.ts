import { env } from "../../config/envConfig";
import { sendResponse } from "../../helper/sendResponse";
import { auth } from "../../lib/auth";
import { createJwtToken, createRefreshToken } from "../../lib/token";
import { ErrorHandler } from "../../utils/errorHandler";
import { TryCatch } from "../../utils/TryCatch";

import {
  loginUser,
  passwordChange,
  passwordForgot,
  passwordReset,
  registerService,
  sessionService,
  verifyOtp,
} from "./auth.service";

export const registerUser = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const register = await registerService(payload);
  sendResponse(res, 200, "Check your email for OTP", register);
});

export const otpVerify = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const { confirmUser } = await verifyOtp(payload);
  sendResponse(res, 200, "User verified successfully", confirmUser);
});

export const login = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const result = await loginUser(payload);

  const user = {
    id: result.user.id,
    email: result.user.email,
    role: result.user.role,
  };
  const createToken = await createJwtToken(user);
  const refreshToken = await createRefreshToken(user);
  const sessionToken = result.token;

  sendResponse(res, 200, "User login successfully", result, {
    token: createToken,
    refreshToken,
    sessionToken,
  });
});

export const changePassword = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await passwordChange(payload, sessionToken);

  sendResponse(res, 200, "Password changed successfully", result);
});

export const forgotPassword = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const data = await passwordForgot(payload);

  sendResponse(res, 200, "Password reset otp sent to your email", data);
});

export const resetPassword = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const data = await passwordReset(payload);

  sendResponse(res, 201, "Password reset successfully", data);
});

export const getSession = TryCatch(async (req, res, next) => {
  const rawToken =
    req.cookies["better-auth.session_token"] ||
    req.cookies["__Secure-better-auth.session_token"] ||
    req.headers.authorization?.split(" ")[1];

  const token = rawToken.includes(".") ? rawToken.split(".")[0] : rawToken;

  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  const result = await sessionService(token);

  sendResponse(res, 200, "Session found", result);
});

export const logoutUser = TryCatch(async (req, res, next) => {
  const sessionToken =
    req.cookies["better-auth.session_token"] ||
    req.cookies["__Secure-better-auth.session_token"];

  if (sessionToken) {
    try {
      await auth.api.signOut({
        headers: new Headers({
          Authorization: `Bearer ${sessionToken}`,
        }),
      });
    } catch (error) {
      console.error("Better-Auth server-side signout failed:", error);
    }
  }

  const isProduction = env.NODE_ENV === "production";
  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  };

  res.cookie("better-auth.session_token", "", cookieOptions);
  res.cookie("__Secure-better-auth.session_token", "", cookieOptions);
  res.cookie("token", "", cookieOptions);
  res.cookie("refreshToken", "", cookieOptions);

  sendResponse(res, 200, "User logout successfully", null);
});
