import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IVendor extends Document {
  profile: mongoose.Types.ObjectId;
  name: string;
  email: string;
  location?: string;
  position: { latitude: number; longitude: number };
  description: string;
  sponsored: boolean;
  blocked: boolean;
  rating: number;
  images: string[];
  phone: string;
  website: string;
  clientsRatings: any;
}

// Schema Definition
const vendorSchema = new Schema<IVendor>(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    name: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts to lowercase
      trim: true, // Removes leading/trailing whitespace
    },

    description: { type: String },
    location: { type: String },
    position: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    sponsored: { type: Boolean, default: false },

    blocked: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // Added images field
    clientsRatings: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);
export default Vendor;
