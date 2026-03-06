import fs from 'fs'
import { Request, Response } from "express";
import { classificationService } from "../services/classificationService";
import { AppError } from "../utils/appError";
import path from 'path';

const uploadPath = 'uploads/fruits'
if(!fs.existsSync(uploadPath)){
  fs.mkdirSync(uploadPath, {recursive: true})
}

export const classificationController = async (req: Request, res: Response) => {
  if(!req.file){
    throw new AppError('Image required', 400)
  }
  if(!req.file.mimetype.startsWith('image/')){
    throw new AppError('Only image allowed', 400)
  }
  const userId = req.userId
  if(!userId){
    throw new AppError('Unauthorized', 401)
  }
  const ext = path.extname(req.file.originalname)
  const imageName = `fruit-${req.userId}-${Date.now()}${ext}`
  const imagePath = path.join(process.cwd(),uploadPath,imageName)
  const imageBuffer = req.file.buffer
  const result = await classificationService({imagePath, imageBuffer, imageName, userId});
  res.status(200).json({
    status:'success',
    data:result.data
  })
};
