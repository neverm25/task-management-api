import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AuthService } from "@/application/services/auth.service";
import { SignUpDto, SignInDto } from "@/domain/entities/user.entity";
import { TYPES } from "@/shared/types";
@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  async signUp(req: Request, res: Response): Promise<void> {
    const userData: SignUpDto = req.body;
    const result = await this.authService.signUp(userData);
    res.status(201).json(result);
  }

  async signIn(req: Request, res: Response): Promise<void> {
    const credentials: SignInDto = req.body;
    const result = await this.authService.signIn(credentials);
    res.json(result);
  }
}
