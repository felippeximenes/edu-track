// src/certificates/certificate.controller.ts
import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";

const service = new CertificateService();

export class CertificateController {
  // Emitir certificado (instrutor / aluno após concluir)
  async issue(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const courseId = Number(req.params.courseId);

      const cert = await service.issueCertificate(userId, courseId);
      return res.json(cert);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Buscar certificados do aluno autenticado
  async getByUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const list = await service.getCertificatesByUser(userId);
      return res.json(list);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Buscar certificado de um curso específico (aluno)
  async getByCourse(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const courseId = Number(req.params.courseId);

      const cert = await service.getUserCertificateForCourse(userId, courseId);
      return res.json(cert);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // 🔥 GERAR PDF (rota protegida — exige token)
  async generatePDF(req: Request, res: Response) {
    try {
      const certId = Number(req.params.certificateId);

      const pdf = await service.generateCertificatePDF(certId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=certificado.pdf");

      return res.send(pdf);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // 🔥 ROTA PÚBLICA — ABRIR PDF NO NAVEGADOR USANDO O CODE (sem token)
  async generatePDFPublic(req: Request, res: Response) {
    try {
      const code = req.params.code;

      const cert = await service.getByCode(code);
      if (!cert) {
        return res.status(404).json({ error: "Certificado não encontrado." });
      }

      const pdf = await service.generateCertificatePDF(cert.id);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=certificado.pdf");

      return res.send(pdf);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Visualizar dados do certificado sem PDF (JSON público)
  async viewPublic(req: Request, res: Response) {
    try {
      const code = req.params.code;
      const cert = await service.getByCode(code);

      if (!cert) {
        return res.status(404).send("Certificado não encontrado.");
      }

      return res.json(cert);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
