import path from "path";

import { Request, Response } from "express";
import sharp from "sharp";

import {
  loginInput,
  zResetPassword,
  zUserSchema,
} from "../validations/userValidate";
import { AppError } from "../utils/appError";
import {
  loginService,
  registerService,
  updateUserProfileService,
  updateUserProfileImageService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/userService";
import { sendEmail } from "../services/emailService";

export const registerController = async (req: Request, res: Response) => {
  const parsed = zUserSchema.safeParse(req.body);
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

export const forgotPasswordController = async (req: Request, res: Response) => {
  const IP = req.ip;
  const { email } = req.body;
  if (!email) {
    throw new AppError("Email is required", 400);
  }
  const otpCode = await forgotPasswordService(email, IP);

  await sendEmail({
    to: email,
    subject: "Reset password",
    text: `OTP for reset password is ${otpCode}`,
  });
  res.status(200).json({
    status: "success",
    message: "OTP send to email",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const IP = req.ip;
  const parsed = zResetPassword.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Invalid input data", 400);
  }

  await resetPasswordService(parsed.data, IP);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
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
  const userId = req.userId;
  if (!req.file) {
    throw new AppError("No image uploaded", 400);
  }
  const ext = path.extname(req.file.originalname);
  const fileName = `profile-image-${req.userId}-${Date.now()}${ext}`;
  const filePath = path.join(process.cwd(), "uploads/users/", fileName);

  await sharp(req.file.buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .toFile(filePath);

  const data = await updateUserProfileImageService(userId as string, fileName);
  res.status(200).json({
    status: "success",
    message: "Profile image updated successfully",
    data,
  });
};
