import { User } from "@prisma/client";
import { SignUpDto } from "../entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: SignUpDto): Promise<User>;
}
