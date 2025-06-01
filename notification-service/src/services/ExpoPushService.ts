import {
  Expo,
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushTicket,
} from "expo-server-sdk";
import config from "../config/config";
import { ExpoPushToken } from "../database";
import mongoose from "mongoose";

export class ExpoPushService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo({ accessToken: config.EXPO_ACCESS_TOKEN });
  }

  async sendPushNotification(
    userId: string | string[], // Allows single token or list of tokens
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    const messages: ExpoPushMessage[] = [];

    // Ensure userId is always an array
    const userIds = Array.isArray(userId) ? userId : [userId];
    console.log("userIds", userIds);
    const ExpoPushTokens = await ExpoPushToken.find({
      user_id: { $in: userIds },
      active: true,
      notification: true,
    });
    const tokens = ExpoPushTokens.map((token) => token.expoPushToken);
    for (const token of tokens) {
      // Validate each Expo push token
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        // await PushToken.updateOne({ ExpoPushToken: token }, { active: false });
        continue;
      }

      // Construct a message for each token
      messages.push({
        to: token,
        sound: "default",
        title,
        body,
        data: data || {},
      });
    }

    if (messages.length === 0) {
      console.error("No valid push tokens found.");
      return;
    }

    try {
      const tickets: ExpoPushTicket[] =
        await this.expo.sendPushNotificationsAsync(messages);
      console.log("Push Notification Tickets:", tickets);
      // Handle the receipts for the tickets
      await this.handleReceipts(tickets);
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }

  async sendMessagePushNotification(
    userId: string | string[], // Allows single token or list of tokens
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    const messages: ExpoPushMessage[] = [];

    // Ensure userId is always an array
    const userIds = Array.isArray(userId) ? userId : [userId];
    const ExpoPushTokens = await ExpoPushToken.find({
      user_id: { $in: userIds },
      active: true,
      notification: true,
      newMessage: true,
    });
    console.log(ExpoPushTokens);
    const tokens = ExpoPushTokens.map((token) => token.expoPushToken);
    for (const token of tokens) {
      // Validate each Expo push token
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        // await PushToken.updateOne({ ExpoPushToken: token }, { active: false });
        continue;
      }

      // Construct a message for each token
      messages.push({
        to: token,
        sound: "default",
        title,
        body,
        data: data || {},
      });
    }

    if (messages.length === 0) {
      console.error("No valid push tokens found.");
      return;
    }

    try {
      const tickets: ExpoPushTicket[] =
        await this.expo.sendPushNotificationsAsync(messages);
      console.log("Push Notification Tickets:", tickets);
      // Handle the receipts for the tickets
      await this.handleReceipts(tickets);
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }
  private async handleReceipts(tickets: ExpoPushTicket[]): Promise<void> {
    const receiptIds = tickets
      .filter((ticket) => ticket.status === "error")
      .map((ticket) => ticket.details?.expoPushToken as string);

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts: { [id: string]: ExpoPushReceipt } =
          await this.expo.getPushNotificationReceiptsAsync(chunk);

        for (const receiptId in receipts) {
          const { status, __debug, details } = receipts[receiptId];

          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${details?.error}`
            );
            if (details && details.error) {
              if (details.error === "DeviceNotRegistered") {
                // Mark the token as inactive
                await ExpoPushToken.updateOne(
                  { expoPushToken: receiptId },
                  { active: false }
                );
                console.log("Token deactivated");
              }
              if (details.error === "InvalidCredentials") {
                await ExpoPushToken.updateOne(
                  { expoPushToken: receiptId },
                  { active: false }
                );
                console.log("Token deactivated");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    }
  }
}
