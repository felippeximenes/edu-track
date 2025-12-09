import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";

const service = new CertificateService();

export class CertificateController {
  async issue(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { courseId } = req.body;

      const certificate = await service.issueCertificate(userId, Number(courseId));

      res.status(201).json(certificate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserCertificates(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const certificates = await service.getCertificatesByUser(userId);

      res.json(certificates);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCertificateByCourse(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { courseId } = req.params;

      const certificate = await service.getUserCertificateForCourse(
        userId,
        Number(courseId)
      );

      if (!certificate)
        return res.status(404).json({ error: "Certificado não encontrado para este curso." });

      res.json(certificate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
