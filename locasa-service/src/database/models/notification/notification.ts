import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface INotification extends Document {
  profile: mongoose.Types.ObjectId;
  title: string;
  message: string;
  icon: string;
  data: object;
  image: String;
  type: string;
  status: string;
}

// Schema Definition
const notificationSchema = new Schema<INotification>(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    data: {
      type: Object,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true }
);

// Exporting the Model
const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
