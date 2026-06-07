import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) { next(err); }
});

router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
});

router.get("/stats", async (_req, res, next) => {
  try {
    const [users, courses, enrollments, certificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ]);
    res.json({ users, courses, enrollments, certificates });
  } catch (err) { next(err); }
});

export default router;
