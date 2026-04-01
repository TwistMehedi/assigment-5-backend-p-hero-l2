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
  console.log("userId eee", userId);
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

  if (result.success) {
    sendResponse(res, 200, "Payment verified and movie unlocked", result);
  } else {
    sendResponse(res, 400, "Payment verification failed", null);
  }
});

export const checkPurchaseMovieAndSeries = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const itemId = req.params.itemId as string;
  const data = await purChaseMovieAndSeries(userId, itemId);

  const result = {
    ...data,
    isPurchased: !!data,
  };
  sendResponse(res, 201, "Checkout session created successfully", result);
});
