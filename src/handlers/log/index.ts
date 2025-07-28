import LogHandler from "./handler.js";
import { logRoutes } from "./routes.js";
import DiscordService from "../../services/discord.js";

interface RegisterOptions {
  discordService: DiscordService;
}

interface Server {
  route: (routes: any[]) => void;
}

export default {
  name: "Log",
  register: async (
    server: Server,
    { discordService }: RegisterOptions
  ): Promise<void> => {
    const logHandler = new LogHandler({ discordService });
    server.route(logRoutes(logHandler));
  },
};
