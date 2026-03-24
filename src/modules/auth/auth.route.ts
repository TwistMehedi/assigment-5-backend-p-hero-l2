import { Router } from "express";
import {
  changePassword,
  login,
  otpVerify,
  registerUser,
} from "./auth.controller";
import { isAuthenticated } from "../../middleware/middleware";
import { registerSchema } from "../../types/zod/auth/zod.register";
import { validateRequest } from "../../middleware/validateRequestZod";
import { loginSchema } from "../../types/zod/auth/login.schema";

const router = Router();

router.route("/register").post(validateRequest(registerSchema), registerUser);
router.route("/verify-otp").post(otpVerify);
router.route("/login").post(validateRequest(loginSchema), login);
router.route("/change-password").post(isAuthenticated, changePassword);

export const authRouter = router;
