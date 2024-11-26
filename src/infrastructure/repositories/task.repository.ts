import { injectable, inject } from "inversify";
import { DatabaseService } from "../database/database.service";
import { ITaskRepository } from "@/domain/repositories/task.repository.interface";
import { CreateTaskDto, EmployeeSummary, SummaryDto } from "@/domain/entities/task.entity";
import { Prisma, Status, Task } from "@prisma/client";
import { TYPES } from "@/shared/types";
import { DefaultArgs } from "@prisma/client/runtime/library";

@injectable()
export class TaskRepository implements ITaskRepository {
  private task: Prisma.TaskDelegate<DefaultArgs>;
  private user: Prisma.UserDelegate<DefaultArgs>;

  constructor(@inject(TYPES.DatabaseService) private readonly databaseService: DatabaseService) {
    this.task = databaseService.getClient().task;
    this.user = databaseService.getClient().user;
  }

  async getAssignedTasks(assigneeId: number): Promise<Task[]> {
    return this.databaseService.getClient().task.findMany({
      where: { assigneeId },
      include: { creator: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: number, assigneeId: number, status: Status): Promise<Task | null> {
    return this.databaseService.getClient().task.update({
      where: { id, assigneeId },
      data: { status },
    });
  }

  async create(creatorId: number, data: CreateTaskDto): Promise<Task> {
    return this.databaseService.getClient().task.create({
      data: {
        ...data,
        creatorId,
      },
    });
  }

  async assign(id: number, creatorId: number, assigneeId: number): Promise<Task> {
    return this.databaseService.getClient().task.update({
      where: { id, creatorId },
      data: { assigneeId },
    });
  }

  async getTasks(
    userId: number,
    assigneeId?: number,
    status?: Status,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<Task[]> {
    const orderBy: Prisma.TaskOrderByWithRelationInput = {};
    if (sortBy === "date") {
      orderBy.createdAt = sortOrder === "desc" ? "desc" : "asc";
    } else if (sortBy === "status") {
      orderBy.status = sortOrder === "desc" ? "desc" : "asc";
    }

    const where: Prisma.TaskWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumStatusFilter;
    }
    if (assigneeId) {
      where.assigneeId = Number(assigneeId);
    }

    where.creatorId = userId;

    return this.databaseService.getClient().task.findMany({
      where,
      orderBy,
      include: {
        assignee: true,
      },
    });
  }

  async getEmployeeTaskSummary(): Promise<SummaryDto[]> {
    const employees = (await this.databaseService.getClient().user.findMany({
      where: { role: "Employee" },
      select: {
        id: true,
        email: true,
        _count: {
          select: {
            assignedTasks: true,
          },
        },
        assignedTasks: {
          where: {
            status: "Completed",
          },
        },
      },
    })) as EmployeeSummary[];

    return employees.map((employee) => ({
      id: employee.id,
      email: employee.email,
      totalTasks: employee._count.assignedTasks,
      completedTasks: employee.assignedTasks.length,
    }));
  }
}
