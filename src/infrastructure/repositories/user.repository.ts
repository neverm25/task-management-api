import { injectable, inject } from "inversify";
import { DatabaseService } from "../database/database.service";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { SignUpDto } from "@/domain/entities/user.entity";
import { hash } from "bcrypt";
import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { TYPES } from "@/shared/types";
@injectable()
export class UserRepository implements IUserRepository {
  private user: Prisma.UserDelegate<DefaultArgs>;

  constructor(@inject(TYPES.DatabaseService) private readonly databaseService: DatabaseService) {
    this.user = this.databaseService.getClient().user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.user.findUnique({ where: { email } });
  }

  async create(data: SignUpDto): Promise<User> {
    const hashedPassword = await hash(data.password, 10);

    return this.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}
