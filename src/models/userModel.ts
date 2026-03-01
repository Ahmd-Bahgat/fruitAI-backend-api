import mongoose, { Schema } from "mongoose";
import { IUser } from "../validations/userValidate";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      maxlength: 225,
    },
    profileImage: String,
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
