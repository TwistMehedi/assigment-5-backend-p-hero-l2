import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./errorHandler";
import { env } from "../config/envConfig";
import { deleteCloudinaryImage } from "../config/cloudinary";

export const errorMiddleware = async (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    for (const field in files) {
      for (const file of files[field] as Express.Multer.File[]) {
        const publicId = file.filename;
        await deleteCloudinaryImage(publicId);
        console.log("Deleted uploaded file due to error:", publicId);
      }
    }
  };

  if (req.file) {
    const publicId = req.file?.filename;
    await deleteCloudinaryImage(publicId);
    console.log("Deleted uploaded file due to error:", publicId);
  }

  err.message = err.message || `Internal server error`;
  err.statusCode = err.statusCode || 500;

  console.log("ERROR", err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    path: req?.originalUrl,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
