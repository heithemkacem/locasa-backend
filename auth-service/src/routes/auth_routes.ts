import { Router } from "express";
import { login, register } from "../controllers/auth_controllers";
import {
  forgetPassword,
  resendOTP,
  resetPassword,
  validateOTP,
} from "../controllers/otp_controller";
import {
  forgetPasswordRequestBody,
  resendOTPRequestBody,
  validateLogin,
  validateOTPRequestBody,
  validateRegister,
  validateResetPassword,
} from "../middleware/dto";
const userRouter = Router();
userRouter.post("/register", validateRegister, register);
userRouter.post("/login", validateLogin, login);
userRouter.post("/validate", validateOTPRequestBody, validateOTP);
userRouter.post("/resend-email-otp", resendOTPRequestBody, resendOTP);
userRouter.post("/forget-password", forgetPasswordRequestBody, forgetPassword);
userRouter.post("/reset-password", validateResetPassword, resetPassword);

export default userRouter;
