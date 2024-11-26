import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import { DatabaseService } from "@/infrastructure/database/database.service";
import { Container } from "@/shared/container";
import { TYPES } from "@/shared/types";
import { errorHandler } from "@/interfaces/http/middleware/error.handler";
import RouterRegistry from "@/interfaces/http/routing";

dotenv.config();

export class Application {
  public app: express.Application;
  private container: Container;
  private databaseService: DatabaseService;
  private routerRegistry: RouterRegistry;

  constructor() {
    this.app = express();
    this.container = new Container();
    this.databaseService = this.container.get(TYPES.DatabaseService);
    this.routerRegistry = new RouterRegistry(this.container);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use("/api", this.routerRegistry.getRoutes());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      const port = process.env.PORT || 3000;

      await this.databaseService.connect();
      console.log("📦 Connected to database");

      this.app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      await this.databaseService.disconnect();
      process.exit(1);
    }
  }
}

const app = new Application();
app.start().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

export default app;
