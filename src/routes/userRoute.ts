import express from "express";

import asyncHandler from "../utils/asyncHandler";
import {
  loginController,
  registerController,
  updateUserProfileController,
  updateUserProfileImageController,
} from "../controllers/userController";
import validateJWT from "../middlewares/validateJWT";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/auth/register", asyncHandler(registerController));
router.post("/auth/login", asyncHandler(loginController));

router.patch(
  "/user/profile",
  validateJWT,
  asyncHandler(updateUserProfileController),
);
router.patch(
  "/user/profile-image",
  validateJWT,
  uploadSingleImage('profileImage'),
  updateUserProfileImageController,
);

export default router;
