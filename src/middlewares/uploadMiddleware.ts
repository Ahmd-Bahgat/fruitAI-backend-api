import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { AppError } from "../utils/appError";
import { Request } from "express";

const uploadPath = "uploads/users";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const uploadSingleImage = (filedName: string) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      if (!req.userId) {
        return cb(new AppError("Unauthorized", 401), "");
      }
      const uniqueName = `profile-image-${req.userId}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const filter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image allowed", 400));
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
