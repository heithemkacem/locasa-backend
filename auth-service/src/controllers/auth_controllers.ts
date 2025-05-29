import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Profile, IProfile, IClient, Vendor, IVendor } from "../database/index"; // Profile model
import { Client, OTP } from "../database/index"; // Client and OTP models
import bcrypt from "bcryptjs";
import {
  ApiError,
  encryptPassword,
  isPasswordMatch,
  successResponse,
  errorResponse,
} from "../utils";
import config from "../config/config";
import { generateOTP } from "../utils/index";
import { rabbitMQService } from "../services/RabbitMQService";
import mongoose from "mongoose";
const { limit } = config;

const jwtSecret = config.JWT_SECRET as string;

const saltRounds = limit ? Number(limit) : 10;
// Utility function to create and send the JWT token
const createSendToken = async (
  user: IProfile,
  client: IClient,
  res: Response
) => {
  const { _id, email, type, name } = user;

  // Prepare the payload with client and profile data
  const payload = {
    id: _id,
    email,
    type,
    name,
    client_id: client._id,
  };

  // Create JWT token with a 30-day expiration
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });

  return token;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, type } = req.body;
    console.log(name);
    const userExists = await Profile.findOne({ email: email, type: type });
    console.log(userExists);
    if (userExists) {
      return res.status(400).json({
        ok: false,
        status: "Failed",
        message: "Email already exists!",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #ED7354; padding: 20px; text-align: center;">
      <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Locasa Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
      <h2 style="color: #fff; margin-top: 10px;">Account Verification</h2>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Dear User,</p>
      <p>Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ED7354;">${otp}</span>
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

    // Send OTP via email

    // Save OTP to database
    await OTP.create({
      email,
      otp: hashedOTP,
      type: "created-account",
      createdAt: new Date(),
      userType: type,
      expiresAt: otpExpiry,
    });
    let client;
    if (type == "client") {
      client = (await Client.create({
        name: name,
        email: email,
      })) as IClient;
    } else {
      client = (await Vendor.create({
        name: name,
        email: email,
      })) as IVendor;
    }

    const profile = (await Profile.create({
      name,
      email,
      password: await encryptPassword(password),
      type: type,
      user_id: client._id,
      source: "app",
    })) as IProfile;
    console.log(client);
    console.log(client.profile);
    client.profile = profile._id as unknown as mongoose.Types.ObjectId;
    await client.save();
    console.log(client);
    try {
      await rabbitMQService.sendEmailNotification(
        email,
        "OTP for Account Registration",
        htmlContent
      );
    } catch (emailError) {
      return errorResponse(
        res,
        "Failed to send OTP email. Please try again later."
      );
    }

    return successResponse(
      res,
      "Registration successful. Please check your email for the OTP."
    );
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, status: "Failed", message: error.message });
  }
};

// Login user function
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body;
    console.log(email);
    // Find the profile by email and include the password field
    const profile = await Profile.findOne({ email, type });
    console.log(profile);
    // If no profile is found or the password is incorrect
    if (!profile) {
      throw new ApiError(400, "Incorrect email or password");
    }
    if (profile.blocked) {
      throw new ApiError(404, `You have been blocked from login`);
    }
    if (!(await isPasswordMatch(password, profile.password as string))) {
      throw new ApiError(400, "Incorrect email or password");
    }
    if (!profile.isVerified) {
      // Check if the user is verified
      return res.json({
        ok: false,
        status: "Verify",
        message: "Account is not verified. Please verify your email first.",
        email: profile.email,
        type: profile.type,
      });
    }
    // Check user type and retrieve the associated data (Client or Hotel)
    let user: any;
    if (type === "vendor") {
      user = await Vendor.findOne({ profile: profile._id });
    } else {
      user = await Client.findOne({ profile: profile._id });
    }

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    profile.loginHistory.unshift({
      action: "login",
      date: new Date().toISOString(),
    });
    profile.save();
    // Create JWT token and send it in a cookie
    const token = await createSendToken(profile, user, res);
    console.log(token, profile.type, profile._id, profile.name);
    // Send success response with the token
    return successResponse(res, "User logged in successfully", {
      token,
      role: profile.type,
      userId: profile._id,
      name: profile.name,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
  }
};
