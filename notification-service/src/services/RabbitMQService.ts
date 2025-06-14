import amqp, { Channel } from "amqplib";
import config from "../config/config";
import { ExpoPushService } from "./ExpoPushService";
import { EmailService } from "./EmailService";

class RabbitMQService {
  private channel!: Channel;
  private expoPushService = new ExpoPushService();
  private emailService = new EmailService();

  constructor() {
    this.init();
  }

  async init() {
    const connection = await amqp.connect(config.msgBrokerURL!);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(config.queue.notifications);
    await this.channel.assertQueue(config.queue.emailQueue);
    await this.consumeNotification();
    await this.consumeEmailNotifications();
  }
  async consumeNotification() {
    console.log("Setting up consumer for notifications queue");
    this.channel.consume(config.queue.notifications, async (msg) => {
      if (!msg) {
        console.log("Received null message");
        return;
      }

      try {
        console.log("Received message:", msg.content.toString());
        const { userId, message, title, data } = JSON.parse(
          msg.content.toString()
        );

        console.log("Processing notification:", {
          userId,
          title,
          message,
          data,
        });

        await this.expoPushService.sendPushNotification(
          userId,
          title,
          message,
          data
        );

        console.log("Successfully sent push notification");
        this.channel.ack(msg);
      } catch (error) {
        console.error("Error processing notification:", error);
        // Don't requeue the message if it's malformed
        this.channel.nack(msg, false, false);
      }
    });
    console.log("Notification consumer setup complete");
  }
  async consumeEmailNotifications() {
    this.channel.consume(config.queue.emailQueue, async (msg) => {
      if (msg) {
        const { to, subject, body } = JSON.parse(msg.content.toString());
        await this.emailService.sendEmail(to, subject, body);
        console.log(`Email sent to ${to}`);
        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
