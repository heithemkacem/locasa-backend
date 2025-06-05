import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IImage extends Document {
  url: string;
  vendor: mongoose.Types.ObjectId;
  name: string;
  size: number;
  key: string;
  mimetype: string;
}

// Schema Definition
const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt fields
);

const ImageModel = mongoose.model<IImage>("Image", imageSchema);
export default ImageModel;
