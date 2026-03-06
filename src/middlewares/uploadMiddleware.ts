import fs from "fs";

import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

import { AppError } from "../utils/appError";

const uploadPath = "uploads/users";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const uploadSingleImage = (filedName: string) => {
  const storage = multer.memoryStorage();
  const filter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files allowed", 400));
    }
  };

  const limits = {
    fileSize: 5 * 1024 * 1024,
  };

  return multer({
    storage: storage,
    fileFilter: filter,
    limits: limits,
  }).single(filedName);
};
