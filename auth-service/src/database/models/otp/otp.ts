import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: "created-account" | "reset-password" | "in-app-change-phone-number";
  createdAt: Date;
  userType: "client" | "vendor";
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true, // Converts to lowercase
      trim: true, // Removes leading/trailing whitespace
    },
    otp: { type: String, required: true },
    type: {
      type: String,
      enum: ["created-account", "reset-password", "in-app-change-phone-number"],
      required: true,
    },
    userType: {
      type: String,
      enum: ["client", "vendor"],
      required: true,
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;
