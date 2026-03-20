import { Router } from "express";
import {
  changePassword,
  login,
  otpVerify,
  registerUser,
} from "./auth.controller";
import { isAuthenticated } from "../../middleware/middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(otpVerify);
router.route("/login").post(login);
router.route("/change-password").post(isAuthenticated, changePassword);

export const authRouter = router;
