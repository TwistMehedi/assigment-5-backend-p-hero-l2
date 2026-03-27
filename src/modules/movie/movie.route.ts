import express from "express";
import {
  addCategoryByAdmin,
  createChannel,
  getCategories,
} from "./movie.controller";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";
import upload from "../../middleware/multer";

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
    createChannel,
  );

export const movieRouter = router;
