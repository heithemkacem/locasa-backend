import { Response } from "express";
import { Client, ExpoPushToken, OTP, Profile } from "../database";
import { AuthedRequest } from "../types/custom/custom";
import { errorResponse, successResponse } from "../utils";

export const deleteAccount = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const client = (await Client.findById(userId)) as any;
    const profile = await Profile.findById(req.user?.id);

    if (!client || !profile) {
      return errorResponse(res, "client_or_profile_not_found", 404);
    }

    await ExpoPushToken.deleteMany({ user_id: profile._id });
    await OTP.deleteMany({ email: profile.email });

    await Promise.all([
      Client.deleteOne({ _id: client._id }),
      Profile.deleteOne({ _id: profile._id }),
    ]);

    return successResponse(res, "account_deleted_successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "server_error", 500);
  }
};
