import express from "express"

export default class App {
    constructor() {
        this.app = express()
        this.appName = process.env.APP_NAME ?? "Bot Senkou"
        this.port = process.env.APP_PORT ?? 3000
        this.availableMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
    }

    register({ services } = {}) {
        if (services) {
            if (typeof services !== "object") {
                throw new Error("Services must be object")
            }

            if (!Array.isArray(services)) {
                throw new Error("Services must be an array")
            }

            services.forEach((service) => {
                if (service.plugin && typeof service.plugin !== "object") {
                    throw new Error("Service plugin must be object")
                }

                let options = {}

                if (service.options) {
                    if (typeof service.options !== "object") {
                        throw new Error("Service options must be object")
                    }

                    options = service.options
                }

                if (service.plugin.register && typeof service.plugin.register !== "function") {
                    throw new Error("Service register must be function")
                }

                service.plugin.register({
                    route: (routes) => {
                        if (!Array.isArray(routes)) {
                            throw new Error("Route callback must return array")
                        }

                        if (routes.length === 0) {
                            throw new Error("Route callback must return array with routes")
                        }

                        routes.forEach((route) => {
                            if (!this.availableMethods.includes(route.method)) {
                                throw new Error("You define route with incorrect HTTP method")
                            }

                            if (typeof route.handler !== "function") {
                                throw new Error("Handler must be exists")
                            }

                            if (typeof route.path !== "string") {
                                throw new Error("Path must be string")
                            }

                            if (route.middleware) {
                                if (typeof route.middleware !== "function") {
                                    throw new Error("Middleware must be function")
                                }

                                this.app[route.method.toLowerCase()](route.path, route.middleware, route.handler)
                                return
                            }

                            this.app[route.method.toLowerCase()](route.path, route.handler)
                        })
                    }
                }, options)
            })
        }

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
    }

    use(middleware) {
        if (typeof middleware !== "function") {
            throw new Error("Middleware must be function")
        }

        this.app.use(middleware)
    }

    set(path, method, handler) {
        if (!this.availableMethods.includes(method)) {
            throw new Error("You define route with incorrect HTTP method")
        }

        if (typeof handler !== "function") {
            throw new Error("Handler must be exists")
        }

        this.app[method.toLowerCase()](path, handler)
    }

    run() {
        this.app.listen(this.port, () => {
            console.log(`${this.appName} runs on port ${this.port}`)
        })
    }
}