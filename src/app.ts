import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./utils/errorMiddleware";
import { authRouter } from "./modules/auth/auth.route";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

export default app;
