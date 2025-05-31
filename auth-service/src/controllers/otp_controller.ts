import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Profile, OTP } from "../database/index";
import { successResponse, errorResponse, generateOTP } from "../utils";
import { rabbitMQService } from "../services/RabbitMQService";
import {
  htmlContentResendOTP,
  htmlContentResetPassword,
} from "../utils/mails_templates";
const saltRounds = 10;

// OTP Validation Function
export const validateOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, type, userType } = req.body;
    const otpRecord = await OTP.findOne({ email, type, userType }).sort({
      createdAt: -1,
    });
    if (!otpRecord) {
      return errorResponse(res, "backend.invalidOtp", 400);
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return errorResponse(res, "backend.invalidOtp", 400);
    }

    const profile = await Profile.findOne({ email, type: userType });
    if (!profile) {
      return errorResponse(res, "backend.userNotFound", 404);
    }

    profile.isVerified = true;
    await profile.save();
    return successResponse(res, "Account successfully verified.");
  } catch (error: unknown) {
    return errorResponse(res, "backend.serverError", 500);
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    const profile = await Profile.findOne({ email, type });
    if (!profile) {
      return errorResponse(res, "backend.emailNotExist", 404);
    }

    const otp = generateOTP();
    console.log(otp, "forget password");
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    await rabbitMQService.sendEmailNotification(
      email,
      "Reset Password OTP",
      htmlContentResetPassword(otp)
    );

    await OTP.create({
      email,
      otp: hashedOTP,
      type: "reset-password",
      createdAt: new Date(),
      userType: type,
    });

    return successResponse(res, "OTP sent to your email for password reset.");
  } catch (error: unknown) {
    return errorResponse(res, "backend.serverError", 500);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, email, type, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      type: "reset-password",
      userType: type,
    }).sort({
      createdAt: -1,
    });
    console.log(newPassword, email, type, otp);
    console.log(otpRecord);
    if (!otpRecord) {
      return errorResponse(res, "backend.invalidOtp", 400);
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return errorResponse(res, "backend.invalidOtp", 400);
    }

    console.log(email, type);
    const profile = await Profile.findOne({ email: email, type: type });
    if (!profile) {
      return errorResponse(res, "backend.userNotFound", 404);
    }

    profile.password = await bcrypt.hash(newPassword, saltRounds);
    await profile.save();

    return successResponse(res, "Password successfully reset.");
  } catch (error: unknown) {
    return errorResponse(res, "backend.serverError", 500);
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, type, userType } = req.body;
    if (!["created-account", "reset-password"].includes(type)) {
      return errorResponse(res, "backend.invalidOtpType", 400);
    }
    // Check for an existing OTP record
    const otpRecord = await OTP.findOne({ email, type, userType });
    if (otpRecord) {
      const now = new Date();
      const lastSentTime = otpRecord.createdAt;
      const timeDifference = (now.getTime() - lastSentTime.getTime()) / 1000;

      // Prevent resending if less than 30 seconds have passed
      if (timeDifference < 30) {
        const remainingTime = 30 - Math.floor(timeDifference);
        return errorResponse(res, `backend.pleaseWaitSeconds`, 400);
      }

      // Delete old OTP if 30 seconds have passed
      await OTP.deleteOne({ email, type, userType });
    }

    // Generate and hash a new OTP
    const otp = generateOTP();
    console.log(otp, "resend");
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    // Save the new OTP in the database
    await OTP.create({
      email,
      otp: hashedOTP,
      type,
      createdAt: new Date(),
      userType: userType,
    });

    rabbitMQService.sendEmailNotification(
      email,
      `${
        type === "created-account" ? "Account Verification" : "Password Reset"
      } OTP`,
      htmlContentResendOTP(otp, type)
    );

    return successResponse(res, "A new OTP has been sent to your email.");
  } catch (error: unknown) {
    return errorResponse(res, "backend.serverError", 500);
  }
};
