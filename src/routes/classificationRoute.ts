import express from "express";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";
import asyncHandler from "../utils/asyncHandler";
import { classificationController } from "../controllers/classificationController";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

router.post(
  "/test",
  validateJWT,
  uploadSingleImage("fruitImage"),
  asyncHandler(classificationController),
);

export default router;
