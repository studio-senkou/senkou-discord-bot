import type { Request, Response, NextFunction } from "express";
import LogHandler from "./handler.js";

interface Route {
  method: string;
  path: string;
  handler: (req: Request, res: Response, next?: NextFunction) => void;
}

export const logRoutes = (logHandler: LogHandler): Route[] => [
  {
    method: "POST",
    path: "/send-log",
    handler: logHandler.handleStoreLogMessage,
  },
];
