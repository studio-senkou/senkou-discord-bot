import {
  type GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import autoBind from "auto-bind";
import { Message } from "discord.js";
import { GenAIService } from "../../services/genai";

export class ChatHandler {
  private prefix = "#";
  private model: GenAIService;

  constructor(genAIService: GenAIService) {
    this.model = genAIService;

    autoBind(this);
  }

  public handle(message: Message): void {
    if (message.author.bot) return;

    if (message.content.startsWith(this.prefix)) {
      this.processCommand(
        message.content.slice(this.prefix.length).trim(),
        message
      );
      return;
    }

    if (message.mentions.has(message.client.user)) {
      this.sendGeminiResponse(message);
      return;
    }
  }

  private async processCommand(
    command: string,
    message: Message
  ): Promise<void> {
    switch (command.toLowerCase()) {
      case "help":
        this.sendHelpMessage(message);
        break;
      case "ping":
        this.sendPingResponse(message);
        break;
      default:
        break;
    }
  }

  private async sendHelpMessage(message: Message): Promise<void> {
    const helpText =
      "Perintah yang bisa dipake:\n" +
      "- `#help`: Buat liat bantuan\n" +
      "- `#ping`: Jawab 'Pong!' buat cek botnya masih hidup";

    await message.reply(helpText);
  }

  private async sendPingResponse(message: Message): Promise<void> {
    await message.reply("Oi, Pong!");
  }

  private async sendGeminiResponse(message: Message): Promise<void> {
    const waitingMessage = await message.reply(
      "Bentar yak, lagi aku proses..."
    );

    try {
      const results = await this.model.generateResponse(message.content);

      await waitingMessage.edit(results[0]);

      results.slice(1).forEach(async (result) => {
        if (message.channel && "send" in message.channel) {
          await (message.channel as any).send(result);
        }
      });
    } catch (error) {
      console.error("Error generating response:", error);
      await waitingMessage.edit(
        "Sorry bang, ada masalah nih waktu aku kirim ke discord."
      );
    }
  }
}
