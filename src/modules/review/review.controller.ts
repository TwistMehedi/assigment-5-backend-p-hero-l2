import { sendResponse } from "../../helper/sendResponse";
import { TryCatch } from "../../utils/TryCatch";
import {
  createReviewService,
  deleteReviewService,
  getReviewsByMedia,
} from "./review.service";

export const createReview = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const result = await createReviewService(userId, req.body);
  sendResponse(res, 201, "Review added successfully", result);
});

export const getMediaReviews = TryCatch(async (req, res, next) => {
  const id = req.query?.id as string;
  const type = req.query?.type as any;
  const result = await getReviewsByMedia(id, type);
  sendResponse(res, 200, "Reviews fetched successfully", result);
});

export const deleteReview = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  await deleteReviewService(id, userId);
  sendResponse(res, 200, "Review deleted successfully", null);
});
