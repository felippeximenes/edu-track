// src/certificate/certificate.controller.ts

import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";

const service = new CertificateService();

export class CertificateController {

  // ======================================================
  // 📌 1. Emitir certificado (instrutor ou aluno após concluir)
  // ======================================================
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

  // ======================================================
  // 📌 2. Buscar todos os certificados do aluno autenticado
  // ======================================================
  async getByUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const list = await service.getCertificatesByUser(userId);
      return res.json(list);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // ======================================================
  // 📌 3. Buscar certificado de um curso específico
  // ======================================================
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

  // ======================================================
  // 📌 4. GERAR PDF protegido (requer token)
  // ======================================================
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

  // ======================================================
  // 📌 5. GERAR PDF público via código (sem token)
  // ======================================================
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

  // ======================================================
  // 📌 6. Rota pública para ver dados do certificado (JSON)
  // ======================================================
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
