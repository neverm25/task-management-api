import { Priority } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(100, "Title must not exceed 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long")
      .max(500, "Description must not exceed 500 characters"),
    dueDate: z
      .string()
      .datetime("Invalid date format")
      .refine((date: string) => new Date(date) > new Date(), "Due date must be in the future"),
    priority: z.nativeEnum(Priority, {
      errorMap: () => ({ message: "Invalid priority level" }),
    }),
    assigneeId: z.number().optional(),
  }),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
