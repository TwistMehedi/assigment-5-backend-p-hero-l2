import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./utils/errorMiddleware";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(errorMiddleware);

export default app;
