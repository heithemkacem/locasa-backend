import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  products: { product: Types.ObjectId; quantity: number }[];
  client: Types.ObjectId;
  brand: Types.ObjectId;
  location: Types.ObjectId;
  orderDate: Date;
  orderStatus: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  totalPrice: number;
}

const orderSchema = new Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          max: 999,
          required: true,
        },
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
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
