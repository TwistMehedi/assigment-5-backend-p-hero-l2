import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../../middleware/middleware";
import {
  createReview,
  deleteReview,
  getMediaReviews,
} from "./review.controller";

const router = Router();

router.route("/create").post(isAuthenticated, createReview);
router.route("/all-reviews").get(getMediaReviews);
router
  .route("/delete/:id")
  .delete(isAuthenticated, authorizeRoles("ADMIN", "CREATOR"), deleteReview);

export const reviewRouter = router;
