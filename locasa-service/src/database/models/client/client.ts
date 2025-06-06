import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IClient extends Document {
  profile: mongoose.Types.ObjectId;
  name: string;
  activities: any[]; // Activities can hold any type of data
  email: string;
  points: number;
  favorite_vendors: Schema.Types.ObjectId[];
  favorite_products: Schema.Types.ObjectId[];
  phone_number: string;
  location: Schema.Types.ObjectId[];
  phone_number_verified: boolean;
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: "Notification";
    }
  ];
}

// Schema Definition
const clientSchema = new Schema<IClient>(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    name: { type: String },
    email: {
      type: String,
      unique: true,
      lowercase: true, // Converts to lowercase
      trim: true,
    },
    points: { type: Number, default: 0 },
    activities: [{ type: Schema.Types.Mixed }], // Accepts any type of data
    favorite_vendors: {
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    },
    favorite_products: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
    phone_number: { type: String }, // Phone number field
    phone_number_verified: { type: Boolean, default: false }, // Flag indicating whether the phone number has been verified
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);

// Exporting the Model
const Client = mongoose.model<IClient>("Client", clientSchema);
export default Client;
