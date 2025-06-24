import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";
import { connectDB } from "./database";
import { healthCheck } from "./middleware/database-check";

const app: Express = express();
let server: Server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", healthCheck);

app.use(errorConverter);
app.use(errorHandler);

const start = async () => {
  try {
    console.log("🚀 Starting notification service initialization...");

    console.log("📡 Initializing RabbitMQ...");
    await rabbitMQService.init();
    console.log("✅ RabbitMQ client initialized");

    console.log("🗄️ Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Only start the server after all initialization is complete
    server = app.listen(config.PORT, () => {
      console.log(`🎉 Notification service is running on port ${config.PORT}`);
      console.log("✅ All services initialized successfully!");
    });
  } catch (err) {
    console.error("❌ Failed to initialize notification service:", err);
    process.exit(1); // Exit if initialization fails
  }
};

start();
const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
