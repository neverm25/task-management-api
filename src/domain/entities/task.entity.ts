import { Priority, Task } from "@prisma/client";

export type CreateTaskDto = {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  assigneeId?: number;
};

export type EmployeeSummary = {
  id: number;
  email: string;
  _count: {
    assignedTasks: number;
  };
  assignedTasks: Array<Task>;
};

export type SummaryDto = {
  id: number;
  email: string;
  totalTasks: number;
  completedTasks: number;
};
