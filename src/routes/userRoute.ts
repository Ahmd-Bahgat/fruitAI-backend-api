import express from "express";

import asyncHandler from "../utils/asyncHandler";
import validateJWT from "../middlewares/validateJWT";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";

import {
  forgotPasswordController,
  getMeController,
  getUsersController,
  loginController,
  registerController,
  resetPasswordController,
  updateUserProfileController,
  updateUserProfileImageController,
} from "../controllers/userController";
import { rateLimit } from "../middlewares/rateLimit";

const router = express.Router();

router.post(
  "/auth/register",
  rateLimit(3, 3600),
  asyncHandler(registerController),
);
router.post(
  "/auth/login",
  rateLimit(5, 300),
  asyncHandler(loginController)
);
router.post(
  "/auth/forgot-password",
  rateLimit(3, 300),
  asyncHandler(forgotPasswordController),
);
router.post(
  "/auth/reset-password",
  rateLimit(3, 300),
  asyncHandler(resetPasswordController),
);

router.patch(
  "/user/profile",
  validateJWT,
  asyncHandler(updateUserProfileController),
);
router.patch(
  "/user/profile-image",
  validateJWT,
  uploadSingleImage("profileImage"),
  asyncHandler(updateUserProfileImageController),
);

router.get("/user/profile", validateJWT, asyncHandler(getMeController));
router.get("/users", asyncHandler(getUsersController));

export default router;
