import mongoose from "mongoose";
import { Category, ExpoPushToken, Profile } from "../database";
import { errorResponse, successResponse } from "../utils";
import bcrypt from "bcryptjs";

export const getProfile = async (req: any, res: any) => {
  try {
    const { id, device_id } = req.params;
    if (!id) {
      return errorResponse(res, "backend.invalid_service_id", 404);
    }
    const expoPushToken = await ExpoPushToken.findOne({
      user_id: id,
      device_id: device_id,
    }).lean();
    if (!expoPushToken) {
      return errorResponse(res, "backend.expo_push_token_not_found", 404);
    }
    return res.status(200).json({
      ok: true,
      status: "success",
      message: "backend.service_retrieved_successfully",
      data: expoPushToken,
    });
  } catch (error) {
    console.error("Error retrieving service:", error);
    return errorResponse(res, "backend.get_profile_failed", 404);
  }
};

export const getUserProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, "backend.invalid_service_id", 404);
    }
    const profile = await Profile.findById(id).lean();
    if (!profile) {
      return errorResponse(res, "backend.profile_not_found", 404);
    }
    return res.status(200).json({
      ok: true,
      status: "success",
      message: "backend.service_retrieved_successfully",
      data: profile,
    });
  } catch (error) {
    console.error("backend.Error retrieving service:", error);
    return errorResponse(res, "backend.get_profile_failed", 404);
  }
};

export const updateProfile = async (req: any, res: any) => {
  try {
    const { userId, device_id } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "backend.invalid_service_id", 404);
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
      return errorResponse(res, "backend.no_expo_push_tokens_found", 404);
    }
    const updatedTokens = await ExpoPushToken.findOne({
      user_id: userId,
      device_id: device_id,
    }).lean();

    return res.status(200).json({
      ok: true,
      status: "success",
      message: "backend.expo_push_tokens_updated",
      data: updatedTokens,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return errorResponse(res, "backend.error_updating_expo_push_tokens", 404);
  }
};

export const addToken = async (req: any, res: any) => {
  try {
    const { expoPushToken, type, device_id, device_type, status } = req.body;
    const validTypes = ["client", "vendor"];
    if (!validTypes.includes(type)) {
      return errorResponse(
        res,
        "backend.invalid_type_must_be_hotel_client_or_admin",
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
        return successResponse(res, "backend.expo_push_token_updated", {
          token: existingToken,
        });
      }
      if (status !== existingToken.notification) {
        existingToken.notification = status;
        existingToken.newMessage = status;
        await existingToken.save();
      }
      return successResponse(res, "backend.expo_push_token_already_exists", {
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
    return successResponse(res, "backend.expo_push_token_added", {
      token: newExpoPushToken,
    });
  } catch (error: any) {
    console.log(error);
    return errorResponse(res, error.message || "backend.server_error", 500);
  }
};

export const changePassword = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return errorResponse(
        res,
        "backend.new_password_and_confirm_password_do_not_match",
        400
      );
    }

    if (!oldPassword) {
      return errorResponse(res, "backend.old_password_is_required", 400);
    }

    const profile = await Profile.findById(userId);
    if (!profile) {
      return errorResponse(res, "backend.user_not_found", 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, profile.password);
    if (!isPasswordValid) {
      return errorResponse(res, "backend.old_password_is_incorrect", 401);
    }

    const isSamePassword = await bcrypt.compare(newPassword, profile.password);
    if (isSamePassword) {
      return errorResponse(
        res,
        "backend.new_password_must_be_different_from_old_password",
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
    return successResponse(res, "password_changed");
  } catch (error) {
    console.error("Error changing password:", error);
    return errorResponse(res, "backend.failed_to_change_password", 500);
  }
};

export const getCategoriesList = async (req: any, res: any) => {
  try {
    const result = await Category.find(); // Added 'await' here
    return successResponse(res, "backend.categories_found", result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(res, "backend.failed_to_fetch_categories", 500);
  }
};
