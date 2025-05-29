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
    await this.channel.assertQueue(config.queue.sendNotificationQueue);
    await this.consumeNotification();
    await this.consumeEmailNotifications();
    await this.consumeSMSNotifications();
    await this.consumeSendNotification();
  }
  async consumeNotification() {
    this.channel.consume(config.queue.notifications, async (msg) => {
      if (msg) {
        try {
          const { userId, message, title, data , type } = JSON.parse(
            msg.content.toString()
          );
          console.log("userId", userId);
          console.log("title", title);
          console.log("message", message);
          console.log("type", type);
          console.log("data", data);
          if(type === "normal-notification"){
            await this.expoPushService.sendPushNotification(
              userId,
              title,
              message,
              data
            );
          }
          if(type === "message-notification"){
            await this.expoPushService.sendMessagePushNotification(
              userId,
              title,
              message,
              data
            );
          }
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

  async consumeSendNotification() {
    this.channel.consume(config.queue.sendNotificationQueue, async (msg) => {
      if (msg) {
        const { to, title, body, data } = JSON.parse(msg.content.toString());
        console.log(to, title, body, data);
        await this.expoPushService.sendPushNotification(to, title, body, data);
        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
