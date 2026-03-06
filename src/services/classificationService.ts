import { Request, Response } from "express";
import path from "path";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import sharp from "sharp";
import { AppError } from "../utils/appError";
import { ClassificationModel } from "../models/classificationModel";

interface Classification {
  imagePath: string;
  imageBuffer: Buffer;
  imageName: string;
  userId: string;
}
export const classificationService = async ({
  imagePath,
  imageBuffer,
  imageName,
  userId,
}: Classification) => {
  await sharp(imageBuffer).resize(1000, 1000).toFile(imagePath);

  const form = new FormData();
  form.append("fruitImage", fs.createReadStream(imagePath));

  const response = await axios.post(process.env.MOCK_AI_URL!, form, {
    headers: form.getHeaders(),
  });
  await ClassificationModel.create({
    user: userId,
    fruit: response.data.fruitName,
    quality: response.data.quality,
    confidence: response.data.confidence,
    image: imageName,
  });
  return response;
};
