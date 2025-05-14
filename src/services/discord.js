import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";

export default class DiscordService {
    constructor() {
        this.client = null;
        this.token = process.env.DISCORD_TOKEN;
        
        if (!this.token) {
            throw new Error('DISCORD_TOKEN is not defined in environment variables');
        }

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });
    }

    init() {
        this.client.once('ready', () => {
            if (this.client.user) {
                console.info(`🤖 Logged in as ${this.client.user.tag}`);
            }
        });

        this.client.login(this.token);
    }

    async sendMessage(channelId, message) {
        try {
            const channel = await this.client.channels.fetch(channelId);
            if (!channel || !channel.isTextBased()) {
                throw new Error('Channel not found or not a text channel');
            }
            await channel.send(message);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}