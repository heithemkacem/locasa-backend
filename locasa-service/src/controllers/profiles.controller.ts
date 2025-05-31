import mongoose from "mongoose";
import { ExpoPushToken, Profile } from "../database";
import { errorResponse, successResponse } from "../utils";
import bcrypt from "bcryptjs";
export const getProfile = async (req: any, res: any) => {
  try {
    const { id, device_id } = req.params;
    if (!id) {
      return errorResponse(res, "ivalid service if", 404);
    }
    const expoPushToken = await ExpoPushToken.findOne({
      user_id: id,
      device_id: device_id,
    }).lean();
    if (!expoPushToken) {
      return errorResponse(res, "Expo push token not found", 404);
    }
    return res.status(200).json({
      ok: true,
      status: "Success",
      message: "Service retrieved successfully",
      data: expoPushToken,
    });
  } catch (error) {
    console.error("Error retrieving service:", error);
    return errorResponse(res, "get profile faield", 404);
  }
};
export const getUserProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, "ivalid service if", 404);
    }
    const profile = await Profile.findById(id).lean();
    if (!profile) {
      return errorResponse(res, "profile not found", 404);
    }
    return res.status(200).json({
      ok: true,
      status: "Success",
      message: "Service retrieved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error retrieving service:", error);
    return errorResponse(res, "get profile faield", 404);
  }
};
export const updateProfile = async (req: any, res: any) => {
  try {
    const { userId, device_id } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "invalid service id", 404);
    }
    const {
      notification,
      emailNotification,
      bookingUpdate,
      newMessage,
      marketing,
    } = updateData;
    const result = await ExpoPushToken.updateOne(
      { user_id: userId, device_id: device_id },
      { notification, newMessage },
      { runValidators: true }
    );
    const result2 = await ExpoPushToken.updateMany(
      { user_id: userId },
      { emailNotification, bookingUpdate, marketing },
      { runValidators: true }
    );
    if (result.matchedCount === 0 || result2.matchedCount === 0) {
      return errorResponse(res, "No Expo push tokens found for this user", 404);
    }
    const updatedTokens = await ExpoPushToken.findOne({
      user_id: userId,
      device_id: device_id,
    }).lean();

    return res.status(200).json({
      ok: true,
      status: "Success",
      message: "Expo push tokens updated successfully",
      data: updatedTokens,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return errorResponse(res, "error updating expo push tokens", 404);
  }
};

export const addToken = async (req: any, res: any) => {
  try {
    const { expoPushToken, type, device_id, device_type, status } = req.body;
    console.log("expoPushToken", expoPushToken);
    console.log("type", type);
    console.log("device_id", device_id);
    console.log("device_type", device_type);
    console.log("status", status);
    const validTypes = ["hotel", "client", "admin"];
    if (!validTypes.includes(type)) {
      return errorResponse(
        res,
        "Invalid type. Must be one of: hotel, client, admin",
        400
      );
    }
    let user: any = req.user;

    const existingToken = await ExpoPushToken.findOne({
      expoPushToken: expoPushToken,
    });

    if (existingToken) {
      if (existingToken.user_id.toString() !== user.id) {
        existingToken.user_id = user.id;
        existingToken.type = type;
        existingToken.device_id = device_id;
        existingToken.device_type = device_type;
        existingToken.notification = status;
        existingToken.newMessage = status;
        await existingToken.save();
        return successResponse(res, "Expo push token updated successfully", {
          token: existingToken,
        });
      }
      if (status !== existingToken.notification) {
        existingToken.notification = status;
        existingToken.newMessage = status;
        await existingToken.save();
      }
      return successResponse(res, "Expo push token already exists", {
        token: existingToken,
      });
    }
    const newExpoPushToken = new ExpoPushToken({
      expoPushToken,
      type,
      active: true,
      device_id,
      device_type,
      user_id: user.id,
      notification: status,
      emailNotification: true,
      bookingUpdate: true,
      newMessage: status,
      marketing: true,
    });

    await newExpoPushToken.save();
    return successResponse(res, "Expo push token added successfully", {
      token: newExpoPushToken,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(res, error.message || "Server error", 500);
  }
};
export const changePassword = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return errorResponse(
        res,
        "New password and confirm password do not match.",
        400
      );
    }

    if (!oldPassword) {
      return errorResponse(res, "Old password is required.", 400);
    }

    const profile = await Profile.findById(userId);
    if (!profile) {
      return errorResponse(res, "User not found.", 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, profile.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Old password is incorrect.", 401);
    }

    const isSamePassword = await bcrypt.compare(newPassword, profile.password);
    if (isSamePassword) {
      return errorResponse(
        res,
        "New password must be different from the old password.",
        400
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    profile.password = hashedPassword;
    profile.loginHistory.unshift({
      action: "password-change",
      date: new Date().toISOString(),
    });
    await profile.save();
    return successResponse(res, "Password changed successfully.");
  } catch (error) {
    console.error("Error changing password:", error);
    return errorResponse(res, "Failed to change password.", 500);
  }
};
