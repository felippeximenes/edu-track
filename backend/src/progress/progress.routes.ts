import { Router } from "express";
import { ProgressController } from "./progress.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new ProgressController();

router.post(
  "/complete",
  authMiddleware,
  requireRole("STUDENT", "ADMIN"),
  controller.complete
);

router.get(
  "/lesson/:lessonId",
  authMiddleware,
  requireRole("STUDENT", "ADMIN"),
  controller.getLessonProgress
);

router.get(
  "/course/:courseId",
  authMiddleware,
  requireRole("STUDENT", "ADMIN"),
  controller.getCourseProgress
);

export default router;
