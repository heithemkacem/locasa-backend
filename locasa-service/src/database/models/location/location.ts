import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface ILocation extends Document {
  profile: mongoose.Types.ObjectId;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: "workplace" | "home" | "other" | "brand";
}

// Schema Definition
const locationSchema = new Schema<ILocation>(
  {
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String },
    type: {
      type: String,
      enum: ["workplace", "home", "other", "brand"],
      required: true,
    },
  },
  { timestamps: true }
);

// Exporting the Model
const Location = mongoose.model<ILocation>("Location", locationSchema);
export default Location;
