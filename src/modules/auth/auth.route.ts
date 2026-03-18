import { Router } from "express";
import { otpVerify, registerUser } from "./auth.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(otpVerify);

export const authRouter = router;
