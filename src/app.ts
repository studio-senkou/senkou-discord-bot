import express, { Express, Request, Response, NextFunction } from "express";

interface Route {
  path: string;
  method: string;
  handler: (req: Request, res: Response, next?: NextFunction) => void;
  middleware?: (req: Request, res: Response, next: NextFunction) => void;
}

interface Service {
  plugin: {
    register: (
      context: { route: (routes: Route[]) => void },
      options: any
    ) => void;
  };
  options?: any;
}

interface RegisterOptions {
  services?: Service[];
}

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export default class App {
  private app: Express;
  private appName: string;
  private port: number;
  private availableMethods: HttpMethod[];

  constructor() {
    this.app = express();
    this.appName = process.env.APP_NAME ?? "Bot Senkou";
    this.port = parseInt(process.env.APP_PORT ?? "3000");
    this.availableMethods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "OPTIONS",
    ];
  }

  register({ services }: RegisterOptions = {}): void {
    if (services) {
      if (typeof services !== "object") {
        throw new Error("Services must be object");
      }

      if (!Array.isArray(services)) {
        throw new Error("Services must be an array");
      }

      services.forEach((service) => {
        if (service.plugin && typeof service.plugin !== "object") {
          throw new Error("Service plugin must be object");
        }

        let options = {};

        if (service.options) {
          if (typeof service.options !== "object") {
            throw new Error("Service options must be object");
          }

          options = service.options;
        }

        if (
          service.plugin.register &&
          typeof service.plugin.register !== "function"
        ) {
          throw new Error("Service register must be function");
        }

        service.plugin.register(
          {
            route: (routes: Route[]) => {
              if (!Array.isArray(routes)) {
                throw new Error("Route callback must return array");
              }

              if (routes.length === 0) {
                throw new Error("Route callback must return array with routes");
              }

              routes.forEach((route) => {
                if (
                  !this.availableMethods.includes(route.method as HttpMethod)
                ) {
                  throw new Error(
                    "You define route with incorrect HTTP method"
                  );
                }

                if (typeof route.handler !== "function") {
                  throw new Error("Handler must be exists");
                }

                if (typeof route.path !== "string") {
                  throw new Error("Path must be string");
                }

                const method = route.method.toLowerCase() as keyof Express;

                if (route.middleware) {
                  if (typeof route.middleware !== "function") {
                    throw new Error("Middleware must be function");
                  }

                  (this.app[method] as any)(
                    route.path,
                    route.middleware,
                    route.handler
                  );
                  return;
                }

                (this.app[method] as any)(route.path, route.handler);
              });
            },
          },
          options
        );
      });
    }

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }

  use(
    middleware: (req: Request, res: Response, next: NextFunction) => void
  ): void;
  use(
    middleware: (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  ): void;
  use(middleware: any): void {
    if (typeof middleware !== "function") {
      throw new Error("Middleware must be function");
    }

    this.app.use(middleware);
  }

  set(
    path: string,
    method: HttpMethod,
    handler: (req: Request, res: Response) => void
  ): void {
    if (!this.availableMethods.includes(method)) {
      throw new Error("You define route with incorrect HTTP method");
    }

    if (typeof handler !== "function") {
      throw new Error("Handler must be exists");
    }

    const methodName = method.toLowerCase() as keyof Express;
    (this.app[methodName] as any)(path, handler);
  }

  run(): void {
    this.app.listen(this.port, () => {
      console.log(`${this.appName} runs on port ${this.port}`);
    });
  }
}
