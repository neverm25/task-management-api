import { TYPES } from "@/shared/types";
import { AuthController } from "../controllers/auth.controller";
import { BaseRouter } from "./base.router";
import { Container } from "@/shared/container";

export class AuthRouter extends BaseRouter {
  private readonly authController: AuthController;

  constructor(container: Container) {
    super(container);
    this.authController = this.container.get(TYPES.AuthController);
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post("/signup", this.authController.signUp.bind(this.authController));

    this.router.post("/signin", this.authController.signIn.bind(this.authController));
  }
}
