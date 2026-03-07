import express from "express";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";
import asyncHandler from "../utils/asyncHandler";
import {
  classificationController,
  classificationHistoryController,
  deleteClassificationController,
} from "../controllers/classificationController";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

router.post(
  "/classification",
  validateJWT,
  uploadSingleImage("fruitImage"),
  asyncHandler(classificationController),
);
router.get(
  "/classification-history",
  validateJWT,
  asyncHandler(classificationHistoryController),
);
router.delete(
  "/classification/:id",
  validateJWT,
  asyncHandler(deleteClassificationController),
);

export default router;
