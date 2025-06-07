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

const app: Express = express();
let server: Server;
// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorConverter);
app.use(errorHandler);
app.use(morgan("dev"));
app.use("/locasa", routes);

connectDB();

server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

const initializeRabbitMQClient = async () => {
  try {
    await rabbitMQService.init();
    console.log("RabbitMQ client initialized and listening for messages.");
  } catch (err) {
    console.error("Failed to initialize RabbitMQ client:", err);
  }
};

initializeRabbitMQClient();

cron.schedule("0 */8 * * *", () => {
  console.log("⏰ Running sync to Typesense every 8 hours");
  syncTypeSense();
});
const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
