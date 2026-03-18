import { sendResponse } from "../../helper/sendResponse";
import { createJwtToken, createRefreshToken } from "../../lib/token";
import { TryCatch } from "../../utils/TryCatch";
import { registerService, verifyOtp } from "./auth.service";

export const registerUser = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const register = await registerService(payload);
  sendResponse(res, 200, "Check your email for OTP", register);
});

export const otpVerify = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const { update, session } = await verifyOtp(payload);

  const user = {
    id: update.id,
    email: update.email,
    role: update.role,
  };

  const createToken = await createJwtToken(user);
  const refreshToken = await createRefreshToken(user);
  const sessionToken = session.token;

  res.cookie("token", createToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const data = {
    createToken,
    refreshToken,
    sessionToken,
    update,
  };
  sendResponse(res, 200, "User verified successfully", data);
});
