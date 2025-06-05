import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  product: Types.ObjectId; // Ref to Product
  client: Types.ObjectId; // Ref to User or Client
  brand: Types.ObjectId; // Ref to Brand
  location: Types.ObjectId;
  orderDate: Date;
  orderStatus: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  totalPrice: number;
}

const orderSchema = new Schema<IOrder>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Client" depending on your model name
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
