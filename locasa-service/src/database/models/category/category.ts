import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  subcategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subcategories: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

// Create index for better query performance
categorySchema.index({ id: 1 });

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
