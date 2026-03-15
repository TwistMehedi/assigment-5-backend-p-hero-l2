import { NextFunction, Request, Response, RequestHandler } from "express";

type TAsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;

export const TryCatch =
  (fn: TAsyncRequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(fn(req, res, next));
    } catch (error) {
      next(error);
    }
  };
