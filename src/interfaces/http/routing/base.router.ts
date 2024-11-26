import { Router as ExpressRouter } from "express";
import { Container } from "@/shared/container";

export abstract class BaseRouter {
  protected router: ExpressRouter;
  protected container: Container;

  constructor(container: Container) {
    this.router = ExpressRouter();
    this.container = container;
  }

  protected abstract initializeRoutes(): void;

  public getRouter(): ExpressRouter {
    return this.router;
  }
}
