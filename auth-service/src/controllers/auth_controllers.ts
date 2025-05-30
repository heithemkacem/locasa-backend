import { Request, Response } from "express";

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
import { generateOTP } from "../utils/index";
import { rabbitMQService } from "../services/RabbitMQService";
import mongoose from "mongoose";
import { htmlContentCreateAccount } from "../utils/mails_templates";
import { createSendToken } from "../utils/jwt/createToken";

const saltRounds = 10;

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
        htmlContentCreateAccount(otp)
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

    const token = await createSendToken(profile, user);

    return successResponse(res, "backend.loginSuccess", {
      token,
      role: profile.type,
      userId: profile._id,
      name: profile.name,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "backend.internal_server_error",
      500
    );
  }
};
