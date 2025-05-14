import autoBind from "auto-bind";

export default class LogHandler {
    constructor({ discordService }) {
        this.discordService = discordService;

        autoBind(this);
    }

    async handleStoreLogMessage(req, res) {
        console.log(req.body)
        const { message, channelId } = req.body;

        if (!message || !channelId) {
            return res.status(400).json({ error: "Message and channelId are required" });
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