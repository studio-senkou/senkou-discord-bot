import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import App from './app.js';

import DiscordService from './services/discord.js';

import logs from "./handlers/log/index.js"

const discordService = new DiscordService();
discordService.init();

dotenv.config();

const app = new App()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("/", "GET", (req, res) => {
    res.send("Hello world")
})

app.register({
   services: [
     {
        plugin: logs,
        options: {
            discordService, 
        }
     }
   ]
})

app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(500).json({
            error: err.message,
        })
    }

    return res.status(500).json({
        error: "Internal server error",
    })
})

app.run()