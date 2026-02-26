import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  error.isOperational = error.isOperational ?? false;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.isOperational ? error.message : 'Something went wrong',
    stack: process.env.NODE_DEV === 'development' ? error.stack : undefined,
    isOperational: error.isOperational,
  });
};
