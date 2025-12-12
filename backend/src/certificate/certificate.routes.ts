import { Router } from "express";
import { CertificateController } from "./certificate.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../auth/role.middleware";

const router = Router();
const controller = new CertificateController();

/*
|--------------------------------------------------------------------------
| 1. Emitir certificado (instrutor)
|--------------------------------------------------------------------------
*/
router.post(
  "/issue/:courseId",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  controller.issue
);

/*
|--------------------------------------------------------------------------
| 2. Listar certificados do aluno autenticado
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  authMiddleware,
  requireRole("STUDENT"),
  controller.getByUser
);

/*
|--------------------------------------------------------------------------
| 3. Buscar certificado de um curso específico (aluno)
|--------------------------------------------------------------------------
*/
router.get(
  "/course/:courseId",
  authMiddleware,
  requireRole("STUDENT"),
  controller.getByCourse
);

/*
|--------------------------------------------------------------------------
| 4. Gerar PDF e abrir no navegador (rota protegida)
|--------------------------------------------------------------------------
*/
router.get(
  "/:certificateId/pdf",
  authMiddleware,
  requireRole("STUDENT"),
  controller.generatePDF
);

/*
|--------------------------------------------------------------------------
| 5. Rota pública — visualizar dados do certificado via code (JSON)
|--------------------------------------------------------------------------
*/
router.get("/public/:code", controller.viewPublic);

/*
|--------------------------------------------------------------------------
| 6. Rota pública — abrir PDF direto no navegador SEM token
|--------------------------------------------------------------------------
*/
router.get("/public/:code/pdf", controller.generatePDFPublic);

export default router;
