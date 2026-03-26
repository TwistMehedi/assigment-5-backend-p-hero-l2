import express from "express";
import { addCategoryByAdmin, getCategories } from "./movie.controller";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";

const router = express.Router();

router
  .route("/create")
  .post(isAuthenticated, authorizeRoles("ADMIN"), addCategoryByAdmin);

router.route("/categories").get(getCategories);

export const movieRouter = router;
