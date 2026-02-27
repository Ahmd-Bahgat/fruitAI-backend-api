import { UserModel } from "../models/userModel";
import { AppError } from "../utils/appError";
import { IUser } from "../validations/userValidate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (data: IUser) => {
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
