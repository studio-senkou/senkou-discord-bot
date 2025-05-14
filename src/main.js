import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from "discord.js"

dotenv.config();

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
  });

client.once('ready', () => {
    console.info(`🤖 Logged in as ${client.user.tag}`)    
})

client.on('messageCreate', (message) => {
    if (message.content === "!ping") {
        message.reply('Pong!')
    }
})

client.login(process.env.DISCORD_TOKEN)