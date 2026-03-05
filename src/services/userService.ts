import path from "path";
import fs from "fs";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { client } from "../configs/redis";

import { UserModel } from "../models/userModel";
import { AppError } from "../utils/appError";
import { ILogin, IUser } from "../validations/userValidate";

export const registerService = async (data: IUser) => {
  const exists = await UserModel.findOne({ email: data.email });
  if (exists) {
    throw new AppError("User already exist", 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await UserModel.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    profileImage: data.profileImage,
  });

  return {
    token: generateJWT(user._id.toString()),
    user: {
      name: data.name,
      email: data.email,
    },
  };
};

export const loginService = async ({ email, password }: ILogin) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Incorrect email or password", 400);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect email or password", 400);
  }
  return {
    token: generateJWT(user._id.toString()),
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const forgotPasswordService = async (email: string, IP: any) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Email not found", 400);
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");

  await client.set(`otp:reset:${IP}:${email}`, hashedOtp, { EX: 300 });

  return otpCode;
};

export const resetPasswordService = async (
  { email, otpCode, newPassword }: any,
  IP: any,
) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const hashedOtp = crypto.createHash("sha256").update(otpCode).digest("hex");
  const redisOtp = await client.get(`otp:reset:${IP}:${email}`);

  if (!redisOtp) {
    throw new AppError("Expired OTP", 400);
  }

  if (hashedOtp !== redisOtp) {
    throw new AppError("Invalid OTP", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  await client.del(`otp:reset:${IP}:${email}`);
  await user.save();
};

export const updateUserProfileService = async ({
  userId,
  name,
  email,
}: any) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      name: name,
      email: email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }
  return updatedUser;
};

export const updateUserProfileImageService = async (
  userId: string,
  newImagePath: string,
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  if (user.profileImage) {
    const oldImageFullPath = path.join(
      process.cwd(),
      "/uploads/users/",
      user.profileImage,
    );
    if (fs.existsSync(oldImageFullPath)) {
      fs.unlinkSync(oldImageFullPath);
    }
  }
  user.profileImage = newImagePath;
  await user.save();
  return user;
};

const generateJWT = (userId: string): string => {
  if (!process.env.SECRET_KEY) {
    throw new AppError("SECRET_KEY is not defined", 500);
  }
  if (!userId) {
    throw new AppError("payload not found", 400);
  }
  return jwt.sign({ userId: userId }, process.env.SECRET_KEY as string, {
    expiresIn: "7d",
  });
};
