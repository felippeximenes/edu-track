import { Router } from "express";
import { CertificateController } from "./certificate.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();
const controller = new CertificateController();

// Emitir certificado
router.post("/issue", authMiddleware, controller.issue.bind(controller));

// Listar todos os certificados do usuário logado
router.get("/user", authMiddleware, controller.getUserCertificates.bind(controller));

// Buscar certificado específico de um curso
router.get("/:courseId", authMiddleware, controller.getCertificateByCourse.bind(controller));

export default router;
