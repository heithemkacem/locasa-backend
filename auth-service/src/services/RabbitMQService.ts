import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
import { Profile } from "../database";
import { ApiError } from "../utils";
import { Types } from "mongoose";

class RabbitMQService {
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    try {
      this.connection = await amqp.connect(config.msgBrokerURL!);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(config.queue.requestQueue);
      await this.channel.assertQueue(config.queue.responseQueue);
      await this.channel.assertQueue(config.queue.emailQueue);
      await this.channel.assertQueue(config.queue.smsQueue);
      this.listenForRequests();
    } catch (error) {
      console.error("Failed to initialize RabbitMQ connection:", error);
    }
  }
  private async listenForRequests() {
    this.channel.consume(config.queue.requestQueue, async (msg) => {
      if (msg && msg.content) {
        const { userId } = JSON.parse(msg.content.toString());
        console.log(msg);
        console.log("rabbitMQ user id in the auth", userId);
        const userDetails = await getUserDetails(userId);

        // Send the user details response
        this.channel.sendToQueue(
          config.queue.responseQueue,
          Buffer.from(JSON.stringify(userDetails)),
          { correlationId: msg.properties.correlationId }
        );

        // Acknowledge the processed message
        this.channel.ack(msg);
      }
    });
  }

  async sendEmailNotification(to: string, subject: string, body: string) {
    const message = { to, subject, body };
    this.channel.sendToQueue(
      config.queue.emailQueue,
      Buffer.from(JSON.stringify(message))
    );
    console.log("Email notification request sent");
  }
  async sendSMSNotification(to: string) {
    const message = { to };
    console.log(message, "message");
    this.channel.sendToQueue(
      config.queue.smsQueue,
      Buffer.from(JSON.stringify(message))
    );
    console.log("SMS notification request sent");
  }
}

const getUserDetails = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }
  const userDetails = await Profile.findById(userId).select("-password");
  if (!userDetails) {
    throw new ApiError(404, "User not found");
  }

  return userDetails;
};

export const rabbitMQService = new RabbitMQService();
