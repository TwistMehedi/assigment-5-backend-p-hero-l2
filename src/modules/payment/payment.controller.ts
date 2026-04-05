import { sendResponse } from "../../helper/sendResponse";
import { ErrorHandler } from "../../utils/errorHandler";
import { TryCatch } from "../../utils/TryCatch";
import {
  checkoutService,
  purChaseMovieAndSeries,
  verifyPaymentService,
} from "./payment.service";

export const checkout = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;

  if (!userId) {
    next(new ErrorHandler("User not found in checkout", 404));
  }
  const { itemId, itemType, price, title } = req.body;

  const data = await checkoutService({
    itemId,
    itemType,
    price,
    title,
    userId,
  });

  sendResponse(res, 201, "Checkout session created successfully", data);
});

export const verifyPayment = TryCatch(async (req, res) => {
  const sessionId = req?.query.sessionId as string;

  const result = await verifyPaymentService(sessionId);

  sendResponse(res, 200, "Payment verified successfully", result);
});

export const checkPurchaseMovieAndSeries = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const itemId = req.params.itemId as string;
  const result = await purChaseMovieAndSeries(userId, itemId);
  sendResponse(res, 201, "Goted movie or series", result);
});
