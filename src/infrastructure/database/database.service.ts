import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";

@injectable()
export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }
}
