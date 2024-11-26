import { CreateTaskDto, SummaryDto } from "../entities/task.entity";
import { Status, Task } from "@prisma/client";

export interface ITaskRepository {
  getAssignedTasks(assigneeId: number): Promise<Task[]>;
  updateStatus(id: number, assigneeId: number, status: Status): Promise<Task | null>;
  create(creatorId: number, data: CreateTaskDto): Promise<Task>;
  assign(id: number, creatorId: number, assigneeId: number): Promise<Task | null>;
  getTasks(userId: number, assigneeId?: number, status?: Status, sortBy?: string, sortOrder?: string): Promise<Task[]>;
  getEmployeeTaskSummary(): Promise<SummaryDto[]>;
}
