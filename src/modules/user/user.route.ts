import express from "express";
import {
  creatorDashBoard,
  getUserDashboardData,
  myPurchaseMoviesAndSeries,
} from "./user.controller";
import { authorizeRoles, isAuthenticated } from "../../middleware/middleware";

const router = express.Router();

router
  .route("/creator")
  .get(isAuthenticated, authorizeRoles("CREATOR"), creatorDashBoard);

router
  .route("/user")
  .get(isAuthenticated, authorizeRoles("USER"), getUserDashboardData);

router
  .route("/puchaed-movies-and-series-by-user")
  .get(isAuthenticated, authorizeRoles("USER"), myPurchaseMoviesAndSeries);

export const userRouter = router;
