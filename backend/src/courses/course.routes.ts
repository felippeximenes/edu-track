import { Router } from "express";
import { CourseController } from "./course.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new CourseController();

// rotas públicas
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// rotas somente para INSTRUCTORS
router.post("/", authMiddleware, requireRole("INSTRUCTOR"), controller.create);
router.put("/:id", authMiddleware, requireRole("INSTRUCTOR"), controller.update);
router.delete("/:id", authMiddleware, requireRole("INSTRUCTOR"), controller.delete);

export default router;
