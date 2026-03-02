import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const notFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 400);
};
