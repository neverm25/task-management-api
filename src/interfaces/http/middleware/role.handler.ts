import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const accessRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized - No user found" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Forbidden - You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
