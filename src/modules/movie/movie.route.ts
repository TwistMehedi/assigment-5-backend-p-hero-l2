import express from "express";
import {
  addCategoryByAdmin,
  channels,
  createChannel,
  deleteChannel,
  getCategories,
  updateChannel,
} from "./movie.controller";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";
import upload from "../../middleware/multer";
import { validateRequest } from "../../middleware/validateRequestZod";
import { channelSchema } from "../../types/zod/movie/schema.movie";

const router = express.Router();

router
  .route("/create-category")
  .post(isAuthenticated, authorizeRoles("ADMIN"), addCategoryByAdmin);

router.route("/categories").get(getCategories);

router
  .route("/create-channel")
  .post(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("image"),
    validateRequest(channelSchema),
    createChannel,
  );

router
  .route("/channels")
  .get(isAuthenticated, authorizeRoles("CREATOR"), channels);

router
  .route("/update-channel/:id")
  .put(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("image"),
    validateRequest(channelSchema),
    updateChannel,
  );

router
  .route("/delete-channel/:id")
  .delete(isAuthenticated, authorizeRoles("CREATOR"), deleteChannel);

export const movieRouter = router;
