import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IVendor extends Document {
  profile: mongoose.Types.ObjectId;
  brands: mongoose.Types.ObjectId[];
  name: string;
  email: string;
  location: mongoose.Types.ObjectId;
  phone: string;
}

// Schema Definition
const vendorSchema = new Schema<IVendor>(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    name: { type: String, required: true },
    phone: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts to lowercase
      trim: true, // Removes leading/trailing whitespace
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);
export default Vendor;
