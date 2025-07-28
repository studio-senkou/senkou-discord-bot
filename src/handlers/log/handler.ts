import type { Request, Response } from "express";
import autoBind from "auto-bind";
import DiscordService from "../../services/discord.js";

interface LogHandlerOptions {
  discordService: DiscordService;
}

export default class LogHandler {
  private discordService: DiscordService;

  constructor({ discordService }: LogHandlerOptions) {
    this.discordService = discordService;
    autoBind(this);
  }

  async handleStoreLogMessage(req: Request, res: Response): Promise<Response> {
    console.log(req.body);
    const { message, channelId } = req.body;

    if (!message || !channelId) {
      return res
        .status(400)
        .json({ error: "Message and channelId are required" });
    }

    try {
      await this.discordService.sendMessage(channelId, message);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }
  }
}
