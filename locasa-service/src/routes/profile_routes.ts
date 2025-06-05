import express from "express";
import {
  addToken,
  changePassword,
  getProfile,
  getUserProfile,
  updateProfile,
} from "../controllers/profiles-controller";
import { verifyToken } from "../middleware";
import {
  validateAddTokenRequestBody,
  validateChangePassword,
  validateUserId,
} from "../middleware/dto";

const router = express.Router();

//!Profile
router.get("/profile/:id/:device_id", verifyToken, getProfile);
router.get("/user-profile/:id", verifyToken, getUserProfile);
router.patch(
  "/profile/:userId/:device_id",
  verifyToken,
  validateUserId,
  updateProfile
);
router.post("/add-token", verifyToken, validateAddTokenRequestBody, addToken);
router.put(
  "/change-password",
  verifyToken,
  validateChangePassword,
  changePassword
);
export default router;
