import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getSession,
  login,
  logoutUser,
  otpVerify,
  registerUser,
  resetPassword,
  credential,
} from "./auth.controller";
import { isAuthenticated } from "../../middleware/middleware";
import { registerSchema } from "../../types/zod/auth/zod.register";
import { validateRequest } from "../../middleware/validateRequestZod";
import { loginSchema } from "../../types/zod/auth/login.schema";
import { forgotEmailSchema } from "../../types/zod/auth/forgotPassword.schema";
import { resetPasswordSchema } from "../../types/zod/auth/reset-password.schema";

const router = Router();

router.route("/register").post(validateRequest(registerSchema), registerUser);
router.route("/verify-otp").post(otpVerify);
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/change-password").post(isAuthenticated, changePassword);
router
  .route("/email-otp/request-password-reset")
  .post(validateRequest(forgotEmailSchema), forgotPassword);
router
  .route("/email-otp/reset-password")
  .post(validateRequest(resetPasswordSchema), resetPassword);
router.route("/get-session").get(getSession);

router.route("/logout-user").post(isAuthenticated, logoutUser);

router.route("/social-login").post(credential);

export const authRouter = router;
