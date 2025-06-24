import express, { Express } from "express";
import { Server } from "http";
import userRouter from "./routes/auth_routes";
import { errorConverter, errorHandler } from "./middleware";
import { connectDB } from "./database";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";
import morgan from "morgan";
import cors from "cors";
import {
  healthCheck,
  checkDatabaseConnection,
} from "./middleware/database-check";

const app: Express = express();
let server: Server;
// Enable CORS for all routes
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no database check needed)
app.get("/health", healthCheck);

// Apply database connection check to all API routes
app.use("/auth", checkDatabaseConnection, userRouter);
app.use(errorConverter);
app.use(errorHandler);

const start = async () => {
  try {
    console.log("🚀 Starting auth service initialization...");

    console.log("📡 Initializing RabbitMQ...");
    await rabbitMQService.init();
    console.log("✅ RabbitMQ client initialized");

    console.log("🗄️ Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Only start the server after all initialization is complete
    server = app.listen(config.PORT, () => {
      console.log(`🎉 Auth service is running on port ${config.PORT}`);
      console.log("✅ All services initialized successfully!");
    });
  } catch (err) {
    console.error("❌ Failed to initialize auth service:", err);
    process.exit(1); // Exit if initialization fails
  }
};

start();
const unexpectedErrorHandler = (error: unknown) => {
  console.log(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
