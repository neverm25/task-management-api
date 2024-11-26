import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TaskService } from "@/application/services/task.service";
import { CreateTaskDto } from "@/domain/entities/task.entity";
import { Status } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/shared/errors/app.error";
import { TYPES } from "@/shared/types";
@injectable()
export class TaskController {
  constructor(@inject(TYPES.TaskService) private readonly taskService: TaskService) {}

  async getAssignedTasks(req: Request, res: Response): Promise<void> {
    const userId = Number(req.user?.id);
    const tasks = await this.taskService.getAssignedTasks(userId);
    res.json(tasks);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      throw new ValidationError("Invalid task ID");
    }

    const userId = Number(req.user?.id);
    const status = req.body.status as Status;

    if (!Object.values(Status).includes(status)) {
      throw new ValidationError("Invalid status value");
    }

    const task = await this.taskService.updateStatus(taskId, userId, status);
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    res.json(task);
  }

  async createTask(req: Request, res: Response): Promise<void> {
    const userId = Number(req.user?.id);
    const taskData: CreateTaskDto = req.body;
    const task = await this.taskService.createTask(userId, taskData);
    res.status(201).json(task);
  }

  async assignTask(req: Request, res: Response): Promise<void> {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      throw new ValidationError("Invalid task ID");
    }

    const userId = Number(req.user?.id);
    const assigneeId = Number(req.body.assigneeId);
    if (isNaN(assigneeId)) {
      throw new ValidationError("Invalid assignee ID");
    }

    const task = await this.taskService.assignTask(taskId, userId, assigneeId);
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    res.json(task);
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const userId = Number(req.user?.id);
    const tasks = await this.taskService.getTasks(userId);
    res.json(tasks);
  }

  async getEmployeeTaskSummary(req: Request, res: Response): Promise<void> {
    const summary = await this.taskService.getEmployeeTaskSummary();
    res.json(summary);
  }
}
