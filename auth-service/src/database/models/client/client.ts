import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IClient extends Document {
  profile: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  activities: any[]; // Activities can hold any type of data
  email: string;
  points: number;
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
    createdAt: { type: Date, default: Date.now },
    activities: [{ type: Schema.Types.Mixed }], // Accepts any type of data
  },
  { timestamps: true }
);

// Exporting the Model
const Client = mongoose.model<IClient>("Client", clientSchema);
export default Client;
