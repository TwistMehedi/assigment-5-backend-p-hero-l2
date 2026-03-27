import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  const url = req.url;
  res.status(404).json({
    success: false,
    message: `Not found this url ${url}`,
  });
};
