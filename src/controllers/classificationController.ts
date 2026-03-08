import fs from "fs";
import path from "path";

import { Request, Response } from "express";

import getPagination from "../utils/pagination";
import { AppError } from "../utils/appError";
import {
  classificationHistoryService,
  classificationService,
  deleteClassificationService,
} from "../services/classificationService";

const uploadPath = "uploads/fruits";
export const createUploadPath = () => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

export const classificationController = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Image required", 400);
  }
  if (!req.file.mimetype.startsWith("image/")) {
    throw new AppError("Only image allowed", 400);
  }
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const ext = path.extname(req.file.originalname);
  const imageName = `fruit-${req.userId}-${Date.now()}${ext}`;
  const imagePath = path.join(process.cwd(), uploadPath, imageName);
  const imageBuffer = req.file.buffer;
  const result = await classificationService({
    imagePath,
    imageBuffer,
    imageName,
    userId,
  });
  res.status(201).json({
    status: "success",
    data: result,
  });
};

export const classificationHistoryController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const { page, limit, skip } = getPagination(req.query);

  const data = await classificationHistoryService({
    userId,
    page,
    limit,
    skip,
  });
  res.status(200).json({
    status: "success",
    ...data,
  });
};

export const deleteClassificationController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const classificationId = req.params.id.toString();
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  if (!classificationId) {
    throw new AppError("Classification id required", 400);
  }
  await deleteClassificationService(classificationId, userId);
  // 204 No content
  res.status(200).json({
    status: "success",
    message: "classification deleted successfully",
  });
};
