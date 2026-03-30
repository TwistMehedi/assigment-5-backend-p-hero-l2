import express from "express";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";
import {
  allSeasons,
  createSeries,
  deleteSeries,
  getAllSeries,
  mySeries,
  mySerieses,
  updateSeason,
  updateSeries,
  uploadEpisode,
  uploadSession,
  season,
} from "./series.controller";
import upload from "../../middleware/multer";
import { validateRequest } from "../../middleware/validateRequestZod";
import {
  createEpisodeSchema,
  createSeriesSchema,
  createSessionSchema,
  updateSeriesSchema,
  updateSessionSchema,
} from "../../types/zod/series/schema.series";

const router = express.Router();

router
  .route("/upload")
  .post(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("poster"),
    validateRequest(createSeriesSchema),
    createSeries,
  );

router
  .route("/update-series/:id")
  .patch(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("poster"),
    validateRequest(updateSeriesSchema),
    updateSeries,
  );

router
  .route("/my-serieses")
  .get(isAuthenticated, authorizeRoles("CREATOR"), mySerieses);

router
  .route("/my-series/:id")
  .get(isAuthenticated, authorizeRoles("CREATOR"), mySeries);

router
  .route("/delete-series/:id")
  .delete(isAuthenticated, authorizeRoles("CREATOR"), deleteSeries);

router.route("/all-series").get(getAllSeries);

router.route("/upload-season").post(
  isAuthenticated,
  authorizeRoles("CREATOR"),
  upload.single("poster"),
  // validateRequest(createSessionSchema),
  uploadSession,
);

router
  .route("/update-season/:id")
  .patch(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("image"),
    validateRequest(updateSessionSchema),
    updateSeason,
  );

router
  .route("/seassions/:seriesId")
  .patch(
    isAuthenticated,
    authorizeRoles("CREATOR"),
    upload.single("image"),
    validateRequest(updateSessionSchema),
    updateSeason,
  );

router
  .route("/all-seasons/:seriesId")
  .get(isAuthenticated, authorizeRoles("CREATOR"), allSeasons);

router
  .route("/season/:seasonid")
  .get(isAuthenticated, authorizeRoles("CREATOR"), season);

router.route("/upload-episode").post(
  isAuthenticated,
  authorizeRoles("CREATOR"),
  upload.single("video"),
  // validateRequest(createEpisodeSchema),
  uploadEpisode,
);

export const seriesRouter = router;
