import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
import { v4 as uuidv4 } from "uuid";
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
      await this.channel.assertQueue(config.queue.request);
      await this.channel.assertQueue(config.queue.response);
      this.channel.consume(config.queue.response, (msg) => {
        if (msg) {
          const correlationId = msg.properties.correlationId;
          const { count, connected, latestMessageAt } = JSON.parse(
            msg.content.toString()
          );
          const resolver = this.correlationMap.get(correlationId);
          if (resolver) {
            resolver({ count, connected, latestMessageAt });
            this.correlationMap.delete(correlationId);
          }
          this.channel.ack(msg);
        }
      });
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
  async getTheNumberOfMessages(
    sender: string,
    receiver: string
  ): Promise<{
    count: number;
    connected: boolean;
    latestMessageAt: string | null;
  }> {
    return new Promise((resolve) => {
      const correlationId = uuidv4();

      const timeout = setTimeout(() => {
        this.correlationMap.delete(correlationId);
        resolve({
          count: 0,
          connected: false,
          latestMessageAt: null,
        });
      }, 5000);

      this.correlationMap.set(correlationId, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      this.channel.sendToQueue(
        config.queue.request,
        Buffer.from(JSON.stringify({ sender, receiver })),
        { correlationId, replyTo: config.queue.response }
      );
    });
  }

  async notifyReceiver(
    receiverId: string,
    title: string,
    message: string,
    type: string
  ) {
    await this.channel.assertQueue(config.queue.notifications); // Double-check
    const notificationPayload = {
      userId: receiverId,
      message: message,
      title: title,
      type: type,
    };

    try {
      await this.channel.assertQueue(config.queue.notifications);
      this.channel.sendToQueue(
        config.queue.notifications,
        Buffer.from(JSON.stringify(notificationPayload))
      );
    } catch (error) {
      console.error(error);
    }
  }
  private async shutdown() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log("RabbitMQ connection closed gracefully");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  }
}
export const rabbitMQService = new RabbitMQService();
