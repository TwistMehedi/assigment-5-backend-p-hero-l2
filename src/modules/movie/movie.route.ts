import express from "express";
import {
  addCategoryByAdmin,
  allMovies,
  channel,
  channels,
  createChannel,
  deleteChannel,
  deleteMovie,
  getCategories,
  movie,
  myMovie,
  myMovies,
  updateChannel,
  updateMovie,
  uploadMovie,
} from "./movie.controller";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";
import upload from "../../middleware/multer";
import { validateRequest } from "../../middleware/validateRequestZod";
import {
  channelSchema,
  createMovieSchema,
  updateMovieSchema,
} from "../../types/zod/movie/schema.movie";

const router = express.Router();

router.route("/movies").get(allMovies);

router.route("/movie/:id").get(movie);

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

router
  .route("/channel/:id")
  .get(isAuthenticated, authorizeRoles("CREATOR"), channel);

// movie
router.route("/upload-movie").post(
  isAuthenticated,
  authorizeRoles("CREATOR"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "poster", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validateRequest(createMovieSchema),
  uploadMovie,
);

router.patch(
  "/update-movie/:id",
  isAuthenticated,
  authorizeRoles("CREATOR"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "poster", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validateRequest(updateMovieSchema),
  updateMovie,
);

router
  .route("/my-movie/:id")
  .get(isAuthenticated, authorizeRoles("CREATOR"), myMovie);

router
  .route("/delete-movie/:id")
  .delete(isAuthenticated, authorizeRoles("CREATOR"), deleteMovie);

router
  .route("/my-movies")
  .get(isAuthenticated, authorizeRoles("CREATOR"), myMovies);

export const movieRouter = router;
