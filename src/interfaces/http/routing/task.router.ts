import { TaskController } from "../controllers/task.controller";
import { BaseRouter } from "./base.router";
import { accessRole } from "../middleware/role.handler";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema } from "../validation/task.schema";
import { TYPES } from "@/shared/types";
import { Container } from "@/shared/container";

export class TaskRouter extends BaseRouter {
  private readonly taskController: TaskController;

  constructor(container: Container) {
    super(container);
    this.taskController = this.container.get(TYPES.TaskController);
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Employee routes
    this.router.get(
      "/assigned",
      accessRole(["Employee"]),
      this.taskController.getAssignedTasks.bind(this.taskController),
    );

    this.router.patch(
      "/:id/status",
      accessRole(["Employee"]),
      this.taskController.updateStatus.bind(this.taskController),
    );

    // Employer routes
    this.router.post(
      "/",
      accessRole(["Employer"]),
      validate(createTaskSchema),
      this.taskController.createTask.bind(this.taskController),
    );

    this.router.get("/", accessRole(["Employer"]), this.taskController.getTasks.bind(this.taskController));

    this.router.patch("/:id", accessRole(["Employer"]), this.taskController.assignTask.bind(this.taskController));

    this.router.get(
      "/employee-summary",
      accessRole(["Employer"]),
      this.taskController.getEmployeeTaskSummary.bind(this.taskController),
    );
  }
}
