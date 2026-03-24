import { NextFunction, Request, Response } from "express";

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validation = await schema.safeParseAsync(req.body);

    if (!validation.success) {
      const formattedErrors: { [key: string]: string } = {};

      validation.error.issues.forEach((issue: any) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    req.body = validation.data;
    next();
  };
};
