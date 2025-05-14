import LogHandler from "./handler.js"
import { logRoutes } from "./routes.js"

export default {
    name: "Log",
    register: async (server, { discordService }) => {
        const logHandler = new LogHandler({ discordService })
        server.route(logRoutes(logHandler))
    }
}