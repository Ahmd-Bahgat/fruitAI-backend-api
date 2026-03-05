import { Request, Response, NextFunction } from "express";
import { client } from "../configs/redis";
import { AppError } from "../utils/appError";

export const rateLimit = (limit: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip;
    const key = `rate:ip:${IP}:${req.path}`;
    const attempt = await client.incr(key);
    if (attempt === 1) {
      await client.expire(key, windowSeconds);
    }
    if (attempt > limit) {
      throw new AppError("Too many requests. Try again later", 429);
    }
    next();
  };
};
