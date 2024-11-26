import { Container as InversifyContainer } from "inversify";
import { DatabaseService } from "@/infrastructure/database/database.service";
import { TaskRepository } from "@/infrastructure/repositories/task.repository";
import { TaskService } from "@/application/services/task.service";
import { TaskController } from "@/interfaces/http/controllers/task.controller";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { AuthService } from "@/application/services/auth.service";
import { AuthController } from "@/interfaces/http/controllers/auth.controller";
import { TYPES } from "./types";

export class Container {
  private container: InversifyContainer;

  constructor() {
    this.container = new InversifyContainer();
    this.registerDependencies();
  }

  public registerDependencies(): void {
    // Infrastructure
    this.container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
    this.container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskRepository);
    this.container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

    // Application Services
    this.container.bind<TaskService>(TYPES.TaskService).to(TaskService);
    this.container.bind<AuthService>(TYPES.AuthService).to(AuthService);

    // Controllers
    this.container.bind<TaskController>(TYPES.TaskController).to(TaskController);
    this.container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  }

  public get<T>(identifier: symbol): T {
    return this.container.get<T>(identifier);
  }
}
