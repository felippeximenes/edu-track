import { Router } from "express";
import CertificateController from "./certificate.controller";
import { authMiddleware } from "../auth/auth.middleware";    // ✅ correção
import { requireRole } from "../auth/role.middleware";        // ✅ correção

const router = Router();
const controller = new CertificateController();

// Emitir certificado (somente instrutor)
router.post(
  "/issue",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  controller.issue
);

// Listar certificados do aluno logado
router.get(
  "/",
  authMiddleware,
  requireRole("STUDENT"),
  controller.getByUser
);

// Buscar certificado do aluno logado por curso
router.get(
  "/course/:courseId",
  authMiddleware,
  requireRole("STUDENT"),
  controller.getByCourse
);

// Gerar PDF autenticado (somente aluno logado)
router.get(
  "/:certificateId/pdf",
  authMiddleware,
  requireRole("STUDENT"),
  controller.generatePDF
);

// 🎯 ROTA PÚBLICA — PDF direto no navegador usando código único
router.get(
  "/public/:code",
  controller.viewPublic
);

export default router;
