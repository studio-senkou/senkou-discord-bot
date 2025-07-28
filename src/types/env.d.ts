declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME?: string;
      APP_PORT?: string;
      DISCORD_TOKEN: string;
      NODE_ENV?: "development" | "production" | "test";
    }
  }
}

export {};
