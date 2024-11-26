import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "@/shared/errors/app.error";
import { Prisma } from "@prisma/client";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code,
    });
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint violation
        res.status(409).json({
          status: "error",
          message: "A record with this data already exists",
          code: "UNIQUE_CONSTRAINT_VIOLATION",
        });
        break;
      case "P2025": // Record not found
        res.status(404).json({
          status: "error",
          message: "Record not found",
          code: "NOT_FOUND",
        });
        break;
      default:
        res.status(500).json({
          status: "error",
          message: "Database error occurred",
          code: "DATABASE_ERROR",
        });
    }
    return;
  }

  // Handle validation errors (e.g., from express-validator)
  if (error.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: error.message,
    });
    return;
  }

  // Handle all other errors
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
