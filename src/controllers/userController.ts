import { Request, Response } from "express";

import { loginInput, zUserSchema } from "../validations/userValidate";
import { AppError } from "../utils/appError";
import {
  loginService,
  registerService,
  updateUserProfileService,
  updateUserProfileImageService,
} from "../services/userService";


export const registerController = async (req: Request, res: Response) => {
  const parsed = zUserSchema.safeParse(req.body);
  console.log(parsed.data);
  if (!parsed.success) {
    throw new AppError("Registration data in invalid", 400);
  }
  const data = await registerService(parsed.data);
  res.status(201).json({
    status: "success",
    ...data,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const parsed = loginInput.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Login data is invalid", 400);
  }
  const data = await loginService(parsed.data);
  res.status(200).json({
    status: "success",
    ...data,
  });
};

export const updateUserProfileController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  const parsed = zUserSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Invalid data", 400);
  }

  const data = await updateUserProfileService({
    userId,
    name: parsed.data.name,
    email: parsed.data.email,
  });
  res.status(200).json({
    status: "success",
    data,
  });
};

export const updateUserProfileImageController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId
  if(!req.file){
    throw new AppError('No image uploaded', 400)
  }
  const imagePath = `/uploads/users/${req.file.filename}`
  const data = await updateUserProfileImageService(userId as string, imagePath)
  res.status(200).json({
    status: 'success',
    message: 'Profile image updated successfully',
    data
  })
};
