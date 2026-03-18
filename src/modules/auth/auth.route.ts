import { Router } from "express";
import { login, otpVerify, registerUser } from "./auth.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(otpVerify);
router.route("/login").post(login);

export const authRouter = router;
