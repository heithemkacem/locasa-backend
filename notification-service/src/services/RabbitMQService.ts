import amqp, { Channel } from "amqplib";
import config from "../config/config";
import { ExpoPushService } from "./ExpoPushService";
import { EmailService } from "./EmailService";
import { TwillioService } from "./TwillioService";

class RabbitMQService {
  private channel!: Channel;
  private expoPushService = new ExpoPushService();
  private emailService = new EmailService();
  private twillioService = new TwillioService();

  constructor() {
    this.init();
  }

  async init() {
    const connection = await amqp.connect(config.msgBrokerURL!);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(config.queue.notifications);
    await this.channel.assertQueue(config.queue.emailQueue);
    await this.channel.assertQueue(config.queue.smsQueue);
    await this.consumeNotification();
    await this.consumeEmailNotifications();
    await this.consumeSMSNotifications();
  }
  async consumeNotification() {
    this.channel.consume(config.queue.notifications, async (msg) => {
      if (msg) {
        try {
          const { userId, message, title, data, image } = JSON.parse(
            msg.content.toString()
          );
          console.log("userId", userId);
          console.log("title", title);
          console.log("message", message);
          console.log("data", data);
          console.log("image", image);
          await this.expoPushService.sendPushNotification(
            userId,
            title,
            message,
            data,
            image
          );

          this.channel.ack(msg);
        } catch (error) {
          console.error("Error processing notification:", error);
          this.channel.nack(msg); // Or handle accordingly
        }
      }
    });
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
  async consumeSMSNotifications() {
    this.channel.consume(config.queue.smsQueue, async (msg) => {
      if (msg) {
        const { to, message } = JSON.parse(msg.content.toString());
        await this.twillioService.sendSMS(to, message);
        console.log(`SMS sent to ${to}`);
        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
