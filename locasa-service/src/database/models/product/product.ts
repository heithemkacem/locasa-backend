import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  promotionPrice?: number;
  brand: Types.ObjectId;
  vendor: Types.ObjectId;
  images: string[];
  colors: string[]; // hex or names
  sizes?: string[]; // like ['S', 'M', 'L']
  details: Record<string, any>; // dynamic per category
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true }, // e.g., 'clothes', 'ceramic', 'jewelry'
    price: { type: Number, required: true },
    promotionPrice: { type: Number },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
