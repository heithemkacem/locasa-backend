import mongoose, { Schema, Document } from "mongoose";

export interface IExpoPushToken extends Document {
  expoPushToken: string; // The Expo push token
  type: "vendor" | "client"; // User role
  active: boolean; // Indicates if the token is active
  device_id: string; // Unique device identifier
  device_type: String; // Device type
  user_id: mongoose.Schema.Types.ObjectId;
  notification: boolean;
  emailNotification: boolean;
  bookingUpdate: boolean;
  newMessage: boolean;
  marketing: boolean;
}

const expoPushTokenSchema = new Schema<IExpoPushToken>(
  {
    expoPushToken: { type: String, required: true }, // Expo push token
    type: {
      type: String,
      enum: ["client", "vendor"], // User roles
      required: true,
    },
    active: { type: Boolean, default: true }, // Token is active by default
    device_id: { type: String, required: true }, // Unique device identifier
    device_type: {
      type: String,
      required: true,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    notification: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    bookingUpdate: { type: Boolean, default: false },
    newMessage: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const ExpoPushToken = mongoose.model<IExpoPushToken>(
  "ExpoPushToken",
  expoPushTokenSchema
);
export default ExpoPushToken;
