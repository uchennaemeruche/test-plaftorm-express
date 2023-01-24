import compression from "compression";
import express, { Application, NextFunction, Request, Response, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import logger from "../helpers/logger";
import { HttpException } from "../helpers/errors";

interface RouteHandler {
    router: Router
}

export class AppServer {

    private app: Application

    constructor(private handlers: RouteHandler[]) {
        this.app = express()
        this.initMiddlewares()
        this.initRouteHandler()
        this.app.use(this.initErrorMiddleware())
    }

    private initMiddlewares() {
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cors())

        // Add logger middleware
        this.app.use(logger)
    }

    private initRouteHandler() {
        this.handlers.map((handler) => {
            this.app.use(`/api/`, handler.router)
        })
        this.app.use((req, res, next) => {
            next(new HttpException(404, "OOps, you hit an unavailable route"));
        });
    }

    private initErrorMiddleware() {
        return (error: HttpException, req: Request, res: Response, next: NextFunction) => {
            let { statusCode = 500, message, data = null } = error
            message = !message ? "Internal Server Error" : error.name + ": " + message
            return res.status(statusCode).json({
                status: false,
                ...(data && data),
                message,
            })
        }
    }

    public startServer(port: number) {
        this.app.listen(port, () => {
            console.log("Connected to Server on port ", port)
        }).on("error", () => {
            process.once("SIGUSR2", () => {
                process.kill(process.pid, "SIGUSR2")
            })
            process.on("SIGINT", () => {
                process.kill(process.pid, "SIGINT")
            })
        })
    }


}