import mongoose from "mongoose";
import config from "../config/config";

export const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.info(
        `🔄 Attempting to connect to database... (attempt ${i + 1}/${retries})`
      );
      console.info(`📍 MongoDB URI: ${config.MONGO_URI?.substring(0, 50)}...`);

      await mongoose.connect(config.MONGO_URI!, {
        serverSelectionTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000, // 45 seconds
        maxPoolSize: 10,
        minPoolSize: 5,
        bufferCommands: false, // Disable mongoose buffering
      });

      console.log("✅ Database connected successfully");

      // Set up connection event listeners
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("🔄 MongoDB reconnected");
      });

      return; // Success, exit the retry loop
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error);

      if (i === retries - 1) {
        console.error("💥 All database connection attempts failed");
        throw error;
      }

      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
