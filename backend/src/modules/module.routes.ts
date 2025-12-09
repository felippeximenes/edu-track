import { Router } from "express";
import { ModuleController } from "./module.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new ModuleController();

router.get("/course/:courseId", controller.listByCourse);
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
