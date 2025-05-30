import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Profile, IProfile, IClient, Vendor, IVendor } from "../database/index";
import { Client, OTP } from "../database/index";
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

const createSendToken = async (
  user: IProfile,
  client: IClient,
  res: Response
) => {
  const { _id, email, type, name } = user;
  const payload = {
    id: _id,
    email,
    type,
    name,
    client_id: client._id,
  };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
  return token;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, type } = req.body;

    const userExists = await Profile.findOne({ email: email, type: type });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        status: "Failed",
        message: "backend.emailExists",
      });
    }

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

    client.profile = profile._id as unknown as mongoose.Types.ObjectId;
    await client.save();

    try {
      await rabbitMQService.sendEmailNotification(
        email,
        "OTP for Account Registration",
        htmlContent
      );
    } catch (emailError) {
      return errorResponse(res, "backend.otpEmailFailed");
    }

    return successResponse(res, "backend.registrationSuccess");
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, status: "Failed", message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body;

    const profile = await Profile.findOne({ email, type });
    if (!profile) {
      throw new ApiError(400, "backend.invalidCredentials");
    }

    if (profile.blocked) {
      throw new ApiError(404, "backend.blockedLogin");
    }

    if (!(await isPasswordMatch(password, profile.password as string))) {
      throw new ApiError(400, "backend.invalidCredentials");
    }

    if (!profile.isVerified) {
      return res.json({
        ok: false,
        status: "Verify",
        message: "backend.accountNotVerified",
        email: profile.email,
        type: profile.type,
      });
    }

    let user: any;
    if (type === "vendor") {
      user = await Vendor.findOne({ profile: profile._id });
    } else {
      user = await Client.findOne({ profile: profile._id });
    }

    if (!user) {
      throw new ApiError(404, "backend.userNotFound");
    }

    profile.loginHistory.unshift({
      action: "login",
      date: new Date().toISOString(),
    });
    profile.save();

    const token = await createSendToken(profile, user, res);

    return successResponse(res, "backend.loginSuccess", {
      token,
      role: profile.type,
      userId: profile._id,
      name: profile.name,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || "Server error", 500);
  }
};
