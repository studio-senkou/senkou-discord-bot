import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, TextChannel } from "discord.js";

export default class DiscordService {
  private client: Client | null;
  private token: string;

  constructor() {
    this.client = null;
    this.token = process.env.DISCORD_TOKEN as string;

    if (!this.token) {
      throw new Error("DISCORD_TOKEN is not defined in environment variables");
    }

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  init(): void {
    if (!this.client) return;

    this.client.once("ready", () => {
      if (this.client?.user) {
        console.info(`🤖 Logged in as ${this.client.user.tag}`);
      }
    });

    this.client.login(this.token);
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    try {
      if (!this.client) {
        throw new Error("Discord client not initialized");
      }

      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        throw new Error("Channel not found or not a text channel");
      }

      await (channel as TextChannel).send(message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  getClient(): Client | null {
    return this.client;
  }
}
