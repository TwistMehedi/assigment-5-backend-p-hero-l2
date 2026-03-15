import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./errorHandler";
import { env } from "../config/envConfig";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.message = err.message || `Internal server error ${err}`;
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    path: req?.originalUrl,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
