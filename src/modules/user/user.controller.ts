import { sendResponse } from "../../helper/sendResponse";
import { TryCatch } from "../../utils/TryCatch";
import {
  getProviderDashboardService,
  getPurchasedAll,
  getUserDashboardService,
} from "./user.service";

export const creatorDashBoard = TryCatch(async (req, res, next) => {
  const providerId = req.user?.id;

  if (!providerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = await getProviderDashboardService(providerId);

  sendResponse(
    res,
    200,
    "Provider dashboard data retrieved successfully",
    result,
  );
});

export const getUserDashboardData = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const result = await getUserDashboardService(userId);

  console.log(result);
  sendResponse(
    res,
    200,

    "User dashboard data retrieved successfully",
    result,
  );
});

export const myPurchaseMoviesAndSeries = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;

  const result = await getPurchasedAll(userId);
  sendResponse(
    res,
    200,
    "Single user all purchase data retrieved successfully",
    result,
  );
});
