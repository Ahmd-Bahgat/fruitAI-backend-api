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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

classificationSchema.virtual("imageUrl").get(function () {
  if (!this.image) {
    return null;
  }

  return `${process.env.BASE_URL}/fruits/${this.image}`;
});

export const ClassificationModel = mongoose.model(
  "Classification",
  classificationSchema,
);
