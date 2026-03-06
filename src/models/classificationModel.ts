import mongoose, { Schema, Types } from "mongoose";

const classificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  fruit: { type: String, required: true },
  quality: String,
  confidence: { type: Number, required: true },
  image: String
});

export const ClassificationModel = mongoose.model('Classification', classificationSchema)