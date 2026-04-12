import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./utils/errorMiddleware";
import { authRouter } from "./modules/auth/auth.route";
import { movieRouter } from "./modules/movie/movie.route";
import { notFound } from "./middleware/notFound";
import { seriesRouter } from "./modules/series/series.route";
import { env } from "./config/envConfig";
import { paymentRouter } from "./modules/payment/payment.route";
import { userRouter } from "./modules/user/user.route";
import { reviewRouter } from "./modules/review/review.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/series", seriesRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/user/dashboard", userRouter);
app.use("/api/v1/review", reviewRouter);

app.use(errorMiddleware);
app.use(notFound);

export default app;
