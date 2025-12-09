import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new EnrollmentController();

router.post(
  "/",
  authMiddleware,
  requireRole("STUDENT"),
  controller.enroll
);

router.get("/user/:userId", controller.getByUser);
router.get("/course/:courseId", controller.getByCourse);

export default router;
