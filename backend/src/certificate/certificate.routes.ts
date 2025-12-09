import { Router } from "express";
import { CertificateController } from "./certificate.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();
const controller = new CertificateController();

router.post("/issue", authMiddleware, controller.issue);
router.get("/", authMiddleware, controller.getUserCertificates);
router.get("/:courseId", authMiddleware, controller.getCertificateByCourse);

export default router;
