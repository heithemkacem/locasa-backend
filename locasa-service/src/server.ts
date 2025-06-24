import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
import { connectDB } from "./database";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";
import routes from "./routes/index";
import morgan from "morgan";
import cors from "cors";
import cron from "node-cron";
import { syncTypeSense } from "./database/scripts/syncTypeSense";
import {
  healthCheck,
  checkDatabaseConnection,
} from "./middleware/database-check";

const app: Express = express();
let server: Server;
// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorConverter);
app.use(errorHandler);
app.use(morgan("dev"));

// Health check endpoint (no database check needed)
app.get("/health", healthCheck);

// Apply database connection check to all API routes
app.use("/locasa", checkDatabaseConnection, routes);

const start = async () => {
  try {
    console.log("🚀 Starting server initialization...");

    console.log("📡 Initializing RabbitMQ...");
    await rabbitMQService.init();
    console.log("✅ RabbitMQ client initialized");

    console.log("🗄️ Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    console.log("🔍 Syncing TypeSense...");
    try {
      await syncTypeSense();
      console.log("✅ TypeSense synced");
    } catch (err) {
      console.warn(
        "⚠️ TypeSense sync failed, but continuing server startup:",
        err
      );
    }

    // Only start the server after all initialization is complete
    server = app.listen(config.PORT, () => {
      console.log(`🎉 Server is running on port ${config.PORT}`);
      console.log("✅ All services initialized successfully!");
    });
  } catch (err) {
    console.error("❌ Failed to initialize services:", err);
    process.exit(1); // Exit if initialization fails
  }
};

start();

cron.schedule("0 */8 * * *", () => {
  console.log("⏰ Running sync to Typesense every 8 hours");
  syncTypeSense();
});
const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
