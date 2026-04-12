import { sendResponse } from "../../helper/sendResponse";
import { TryCatch } from "../../utils/TryCatch";
import {
  getAdminDashboardService,
  getProviderDashboardService,
  getPurchasedAll,
  getUserDashboardService,
  getAllTransactionsService,
  getAllMoviesForAdminService,
  getAllSeriesForAdminService,
  getAllUserService,
  updateUserRoleService,
  deleteUserService,
  watchLetterService,
} from "./user.service";

export const getAdminDashboardData = TryCatch(async (req, res, next) => {
  const result = await getAdminDashboardService();

  sendResponse(res, 200, "Admin dashboard data retrieved successfully", result);
});

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

export const getAllTransactions = TryCatch(async (req, res) => {
  const { page, limit, searchTerm } = req.query;

  const result = await getAllTransactionsService({
    page: page as string,
    limit: limit as string,
    searchTerm: searchTerm as string,
  });

  sendResponse(res, 200, "All transactions retrieved successfully", result);
});

export const getAllMoviesForAdmin = TryCatch(async (req, res) => {
  const result = await getAllMoviesForAdminService();

  sendResponse(res, 200, "All movies retrieved for admin successfully", result);
});

export const getAllSeriesForAdmin = TryCatch(async (req, res) => {
  const result = await getAllSeriesForAdminService();

  sendResponse(res, 200, "All series retrieved for admin successfully", result);
});

export const getAllUsersForAdmin = TryCatch(async (req, res, next) => {
  const result = await getAllUserService((req.query.search as string) || "");
  sendResponse(res, 200, "All users goted successfully for admin", result);
});

export const updateUserRole = TryCatch(async (req, res) => {
  const { id, role } = req.body;
  const result = await updateUserRoleService(id, role);
  sendResponse(res, 200, "User role updated successfully", result);
});

export const deleteUser = TryCatch(async (req, res) => {
  const id = req.params.id as string;
  await deleteUserService(id);
  sendResponse(res, 200, "User deleted successfully", null);
});

export const watchLetter = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const result = await watchLetterService(userId, req.body);
  sendResponse(res, 201, "Watch Letter added successfully", result);
});
