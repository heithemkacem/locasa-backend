import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for TypeScript typing
export interface IBrand extends Document {
  vendor: Types.ObjectId;
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  location: Types.ObjectId;
  category: string;
  reviews: Types.ObjectId[];
  reviewsCount: number;
  rating: number;
  products: Types.ObjectId[];
  orders: Types.ObjectId[];
}

// Schema Definition
const brandSchema = new Schema<IBrand>(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    reviewsCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

// Exporting the Model
const Brand = mongoose.model<IBrand>("Brand", brandSchema);
export default Brand;
