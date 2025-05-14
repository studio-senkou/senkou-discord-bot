export const logRoutes = (logHandler) => [
    {
        method: "POST",
        path: "/send-log",
        handler: logHandler.handleStoreLogMessage
    }
]