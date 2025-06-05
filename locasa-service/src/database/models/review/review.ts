import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  likes: number;
  dislikes: number;
}

const reviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
