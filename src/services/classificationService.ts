import fs from "fs";

import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";

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
  const AI_URL = process.env.MOCK_AI_URL;
  if (!AI_URL) {
    throw new AppError("AI_URL is not defined in environment variables", 500);
  }
  const { data } = await axios.post(AI_URL, form, {
    headers: form.getHeaders(),
    timeout: 10000,
  });

  //fs.unlinkSync(imagePath);

  const classification = await ClassificationModel.create({
    user: userId,
    fruit: data.fruitName,
    quality: data.quality,
    confidence: data.confidence,
    image: imageName,
  });
  return classification;
};

interface ClassificationHistoryParams {
  userId: string;
  page: number;
  limit: number;
  skip: number;
}
export const classificationHistoryService = async ({
  userId,
  page,
  limit,
  skip,
}: ClassificationHistoryParams) => {
  const classification = await ClassificationModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ClassificationModel.countDocuments({ user: userId });
  const count = classification.length;
  return {
    total,
    count,
    page,
    limit,
    data: classification,
  };
};

export const deleteClassificationService = async (
  classificationId: string,
  userId: string,
) => {
  const classification = await ClassificationModel.findOneAndDelete({
    _id: classificationId,
    user: userId,
  });
  if (!classification) {
    throw new AppError("Classification not found", 404);
  }
  return classification;
};
