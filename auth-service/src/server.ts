import express, { Express } from "express";
import { Server } from "http";
import userRouter from "./routes/auth_routes";
import { errorConverter, errorHandler } from "./middleware";
import { connectDB } from "./database";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";
import morgan from "morgan";
import cors from "cors";
const app: Express = express();
let server: Server;
// Enable CORS for all routes
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", userRouter);
app.use(errorConverter);
app.use(errorHandler);

const start = async () => {
  try {
    await rabbitMQService.init();
    await connectDB();
    console.log("RabbitMQ client initialized and listening for messages.");
  } catch (err) {
    console.error("Failed to initialize RabbitMQ client:", err);
  }
};

start();
server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
const unexpectedErrorHandler = (error: unknown) => {
  console.log(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
