import { injectable, inject } from "inversify";
import { ITaskRepository } from "@/domain/repositories/task.repository.interface";
import { CreateTaskDto, SummaryDto } from "@/domain/entities/task.entity";
import { Status, Task } from "@prisma/client";
import { TYPES } from "@/shared/types";

@injectable()
export class TaskService {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: ITaskRepository) {}

  async getAssignedTasks(assigneeId: number): Promise<Task[]> {
    return this.taskRepository.getAssignedTasks(assigneeId);
  }

  async updateStatus(id: number, assigneeId: number, status: Status): Promise<Task | null> {
    return this.taskRepository.updateStatus(id, assigneeId, status);
  }

  async createTask(creatorId: number, data: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(creatorId, data);
  }

  async assignTask(id: number, creatorId: number, assigneeId: number): Promise<Task | null> {
    return this.taskRepository.assign(id, creatorId, assigneeId);
  }

  async getTasks(
    userId: number,
    assigneeId?: number,
    status?: Status,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(userId, assigneeId, status, sortBy, sortOrder);
  }

  async getEmployeeTaskSummary(): Promise<SummaryDto[]> {
    return this.taskRepository.getEmployeeTaskSummary();
  }
}
