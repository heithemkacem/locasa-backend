import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";

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
    console.log("Email notification request sent");
  }
}

export const rabbitMQService = new RabbitMQService();
