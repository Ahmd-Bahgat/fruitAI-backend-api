import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }
  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY as string, (err, payload) => {
    if (err || !payload || typeof payload === "string") {
      throw new AppError("Unauthorized", 401);
    }
    req.userId = payload.userId;
    next();
  });
};

export default validateJWT;
