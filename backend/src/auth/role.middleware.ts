import { Request, Response, NextFunction } from "express";

export function requireRole(role: "INSTRUCTOR" | "STUDENT") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}
