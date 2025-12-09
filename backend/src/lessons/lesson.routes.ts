import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new LessonController();

router.get("/module/:moduleId", controller.listByModule);
router.get("/:id", controller.getById);

router.post(
  "/",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  controller.create
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  controller.update
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  controller.delete
);

export default router;
