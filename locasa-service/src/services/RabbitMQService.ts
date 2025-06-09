import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
class RabbitMQService {
  private correlationMap = new Map<
    string,
    ({
      count,
      connected,
      latestMessageAt,
    }: {
      count: number;
      connected: boolean;
      latestMessageAt: string | null;
    }) => void
  >();
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    try {
      this.connection = await amqp.connect(config.msgBrokerURL!);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(config.queue.notifications);
      await this.channel.assertQueue(config.queue.emailQueue);
    } catch (error) {
      console.error("Failed to initialize RabbitMQ connection:", error);
    }
  }

  async sendEmailNotification(to: string, subject: string, body: string) {
    const message = { to, subject, body };
    this.channel.sendToQueue(
      config.queue.emailQueue,
      Buffer.from(JSON.stringify(message))
    );
  }

  async notifyReceiver(
    receiverId: string,
    title: string,
    message: string,
    image?: string,
    data?: object
  ) {
    console.log('Sending notification for receiver:', receiverId);
    const notificationPayload = {
      userId: receiverId,
      message,
      title,
      image: image || "",
      data: data || {},
    };

    try {
      await this.channel.assertQueue(config.queue.notifications);
      console.log('Sending notification payload:', notificationPayload);
      this.channel.sendToQueue(
        config.queue.notifications,
        Buffer.from(JSON.stringify(notificationPayload))
      );
      console.log('Notification sent to queue successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}
export const rabbitMQService = new RabbitMQService();
