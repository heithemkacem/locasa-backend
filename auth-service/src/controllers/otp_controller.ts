import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Profile, OTP } from "../database/index";
import { successResponse, errorResponse, generateOTP } from "../utils";
import config from "../config/config";
import { rabbitMQService } from "../services/RabbitMQService";
const { limit } = config;
const saltRounds = limit ? Number(limit) : 10;
// OTP Validation Function
export const validateOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, type, userType } = req.body;
    const otpRecord = await OTP.findOne({ email, type, userType }).sort({
      createdAt: -1,
    });
    if (!otpRecord) {
      return errorResponse(res, "Invalid OTP or OTP has expired.", 400);
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return errorResponse(res, "Invalid OTP.", 400);
    }

    const profile = await Profile.findOne({ email, type: userType });
    if (!profile) {
      return errorResponse(res, "User not found.", 404);
    }

    profile.isVerified = true;
    await profile.save();
    return successResponse(res, "Account successfully verified.");
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
  }
};
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    const profile = await Profile.findOne({ email, type });
    if (!profile) {
      return errorResponse(res, "Email does not exist.", 404);
    }

    const otp = generateOTP();
    console.log(otp, "forget password");
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #ED7354; padding: 20px; text-align: center;">
      <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Company Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
      <h2 style="color: #fff; margin-top: 10px;">Password Reset Request</h2>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Dear User,</p>
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ED7354;"> ${otp}</span>
      </div>
      <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
      <p>Stay secure,<br/>The Locasa Team</p>
    </div>
    <div style="background-color: #f7f7f7; text-align: center; padding: 15px; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} Locasa. All rights reserved.
    </div>
  </div>
`;
    await rabbitMQService.sendEmailNotification(
      email,
      "Reset Password OTP",
      htmlContent
    );

    await OTP.create({
      email,
      otp: hashedOTP,
      type: "reset-password",
      createdAt: new Date(),
      userType: type,
    });

    return successResponse(res, "OTP sent to your email for password reset.");
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
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
      return errorResponse(res, "Invalid OTP or OTP has expired.", 400);
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return errorResponse(res, "Invalid OTP.", 400);
    }

    console.log(email, type);
    const profile = await Profile.findOne({ email: email, type: type });
    if (!profile) {
      return errorResponse(res, "User not found.", 404);
    }

    profile.password = await bcrypt.hash(newPassword, saltRounds);
    await profile.save();

    return successResponse(res, "Password successfully reset.");
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, type, userType } = req.body;
    if (!["created-account", "reset-password"].includes(type)) {
      return errorResponse(res, "Invalid OTP type.", 400);
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
        return errorResponse(
          res,
          `Please wait ${remainingTime} seconds before requesting a new OTP.`,
          400
        );
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
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #ED7354; padding: 20px; text-align: center;">
        <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Company Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
        <h2 style="color: #fff; margin-top: 10px;">OTP Verification</h2>
      </div>
      <div style="padding: 30px; color: #333;">
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP)  is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #ED7354;"> ${otp}</span>
        </div>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not initiate this request, please ignore this email.</p>
        <p>Best regards,<br/>The Locasa Team</p>
      </div>
      <div style="background-color: #f7f7f7; text-align: center; padding: 15px; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Locasa. All rights reserved.
      </div>
    </div>
  `;
    await rabbitMQService.sendEmailNotification(
      email,
      `${type} OTP`,
      htmlContent
    );

    return successResponse(res, "A new OTP has been sent to your email.");
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
  }
};
