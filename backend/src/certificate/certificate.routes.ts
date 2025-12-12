// src/certificate/certificate.routes.ts
import { Router } from "express";
import { CertificateController } from "./certificate.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();
const controller = new CertificateController();

/*  
|--------------------------------------------------------------------------
| ROTAS DE CERTIFICADO (PROTEGIDAS)
|--------------------------------------------------------------------------
| Todas as rotas abaixo exigem token JWT válido.
| São usadas quando o aluno está logado e deseja visualizar,
| emitir ou baixar seus próprios certificados.
|--------------------------------------------------------------------------
*/

// 📌 Listar todos os certificados do aluno autenticado
router.get("/", authMiddleware, controller.getByUser.bind(controller));

// 📌 Buscar certificado de um curso específico do aluno
router.get(
  "/course/:courseId",
  authMiddleware,
  controller.getByCourse.bind(controller)
);

// 📌 Emitir certificado (aluno concluiu o curso)
router.post(
  "/issue/:courseId",
  authMiddleware,
  controller.issue.bind(controller)
);

// 📌 Gerar PDF autenticado (precisa token)
router.get(
  "/pdf/:certificateId",
  authMiddleware,
  controller.generatePDF.bind(controller)
);

/*  
|--------------------------------------------------------------------------
| ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
|--------------------------------------------------------------------------
| Qualquer pessoa pode abrir essas rotas:
| - Ver dados do certificado via código (JSON)
| - Abrir o PDF diretamente no navegador via código público
|--------------------------------------------------------------------------
*/

// 🔓 Visualizar dados do certificado via código público
router.get("/public/:code", controller.viewPublic.bind(controller));

// 🔓 Gerar e abrir PDF público no navegador (sem token)
router.get(
  "/public/:code/pdf",
  controller.generatePDFPublic.bind(controller)
);

export default router;
