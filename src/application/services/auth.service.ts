import { injectable, inject } from "inversify";
import { SignUpDto, SignInDto, AuthResponse } from "@/domain/entities/user.entity";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ValidationError, UnauthorizedError } from "@/shared/errors/app.error";
import { JWT_SECRET } from "@/shared/constants";
import { User } from "@prisma/client";
import { TYPES } from "@/shared/types";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }

    const user = await this.userRepository.create(data);
    const token = this.generateToken(user);

    return { user, token };
  }

  async signIn(data: SignInDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    return sign({ user }, JWT_SECRET, { expiresIn: "1d" });
  }
}
