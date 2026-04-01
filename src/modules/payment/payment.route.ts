import express from "express";
import { isAuthenticated } from "../../middleware/middleware";
import {
  checkout,
  checkPurchaseMovieAndSeries,
  verifyPayment,
} from "./payment.controller";

const router = express.Router();

router.route("/create-checkout-session").post(isAuthenticated, checkout);
router.route("/verify").get(isAuthenticated, verifyPayment);
router
  .route("/check-purchase/:id")
  .get(isAuthenticated, checkPurchaseMovieAndSeries);

export const paymentRouter = router;
