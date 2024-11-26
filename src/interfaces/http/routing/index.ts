import { Router as ExpressRouter } from "express";
import { TaskRouter } from "./task.router";
import { AuthRouter } from "./auth.router";
import { authenticate } from "../middleware/auth.middleware";
import { Container } from "@/shared/container";

class RouterRegistry {
  private readonly router: ExpressRouter;

  constructor(container: Container) {
    this.router = ExpressRouter();
    this.registerRoutes(container);
  }

  private registerRoutes(container: Container): void {
    this.router.use("/auth", new AuthRouter(container).getRouter());

    this.router.use("/tasks", authenticate, new TaskRouter(container).getRouter());
  }

  public getRoutes(): ExpressRouter {
    return this.router;
  }
}

export default RouterRegistry;
