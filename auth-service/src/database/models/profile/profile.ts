import mongoose, { Schema, Document } from "mongoose";
type LoginHistory = {
  action: string;
  date: Date | string;
};
const loginHistorySchema = new Schema({
  action: { type: String, required: true },
  date: { type: Date, required: true },
});
// Interface for TypeScript typing
export interface IProfile extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type: "client" | "vendor";
  isVerified: boolean;
  createdAt: Date;
  user_id: mongoose.Schema.Types.ObjectId;
  isPhoneVerified: boolean;
  loginHistory: LoginHistory[];
  blocked: boolean;
  source: string;
}
const profileSchema = new Schema<IProfile>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true, // Converts to lowercase
      trim: true, // Removes leading/trailing whitespace
    },
    name: { type: String, required: true },
    password: { type: String },
    phone: { type: String },
    isPhoneVerified: { type: Boolean, default: true },
    type: {
      type: String,
      enum: ["client", "vendor"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    loginHistory: { type: [loginHistorySchema], default: [] }, // Updated loginHistory
    blocked: { type: Boolean, default: false },
    source: { type: String, required: true },
  },
  { timestamps: true }
);

// Exporting the Model
const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
