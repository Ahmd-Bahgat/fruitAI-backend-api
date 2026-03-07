import fs from "fs";
import { Request, Response } from "express";
import { classificationHistoryService, classificationService, deleteClassificationService } from "../services/classificationService";
import { AppError } from "../utils/appError";
import path from "path";
import { json } from "zod";

const uploadPath = "uploads/fruits";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

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
  res.status(200).json({
    status: "success",
    data: result.data,
  });
};

export const classificationHistoryController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId
  if(!userId){
    throw new AppError('Unauthorized', 401)
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit )|| 10
  const skip = (page - 1) * limit
  const data = await classificationHistoryService({userId, page, limit, skip})
  res.status(200).json({
    status: 'success',
    ...data
  })
};

export const deleteClassificationController = async (req:Request, res:Response) => {
  const userId = req.userId
  const classificationId = req.params.id
  if(!userId){
    throw new AppError('Unauthorized', 401)
  }
  if(!classificationId){
    throw new AppError('Classification id required', 400)
  }
  await deleteClassificationService(classificationId as string, userId)
  res.status(200).json({
    status: 'success',
    message: 'classification deleted successfully'
  })

}
