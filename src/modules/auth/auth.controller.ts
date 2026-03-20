import { sendResponse } from "../../helper/sendResponse";
import { createJwtToken, createRefreshToken } from "../../lib/token";
import { TryCatch } from "../../utils/TryCatch";

import {
  loginUser,
  passwordChange,
  registerService,
  verifyOtp,
} from "./auth.service";

export const registerUser = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const register = await registerService(payload);
  sendResponse(res, 200, "Check your email for OTP", register);
});

export const otpVerify = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const { confirmUser, session } = await verifyOtp(payload);

  const user = {
    id: confirmUser.id,
    email: confirmUser.email,
    role: confirmUser.role,
  };

  const createToken = await createJwtToken(user);
  const refreshToken = await createRefreshToken(user);
  const sessionToken = session.token;

  sendResponse(res, 200, "User verified successfully", confirmUser, {
    token: createToken,
    refreshToken,
    sessionToken,
  });
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
