import mongoose, { Schema, Types } from "mongoose";

const classificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    fruit: { type: String, required: true },
    quality: { type: String, required: true },
    confidence: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ClassificationModel = mongoose.model(
  "Classification",
  classificationSchema,
);
