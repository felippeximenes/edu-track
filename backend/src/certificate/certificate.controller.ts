import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";

const service = new CertificateService();

export class CertificateController {

  // Emitir certificado (instrutor)
  async issue(req: Request, res: Response) {
    const { courseId, userId } = req.body;

    const certificate = await service.issueCertificate(userId, courseId);
    res.status(201).json(certificate);
  }

  // Buscar certificados do usuário logado (aluno)
  async getByUser(req: Request, res: Response) {
    const userId = req.user.id;
    const certificates = await service.getCertificatesByUser(userId);
    res.json(certificates);
  }

  // Buscar certificado do usuário logado por curso
  async getByCourse(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user.id;

    const certificates = await service.getUserCertificateForCourse(
      userId,
      Number(courseId)
    );

    res.json(certificates);
  }

  // Gerar PDF autenticado (rota protegida)
  async generatePDF(req: Request, res: Response) {
    const { certificateId } = req.params;

    try {
      const pdfBuffer = await service.generateCertificatePDF(Number(certificateId));

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=certificado.pdf");
      res.setHeader("Content-Length", pdfBuffer.length);

      return res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao gerar PDF" });
    }
  }

  // ✅ ROTA PÚBLICA PARA ABRIR PDF PELO CÓDIGO
  async viewPublic(req: Request, res: Response) {
    const { code } = req.params;

    try {
      const certificate = await service.getByCode(code);

      if (!certificate) {
        return res.status(404).send("Certificado não encontrado.");
      }

      // Gera PDF pelo ID do certificado
      const pdfBuffer = await service.generateCertificatePDF(certificate.id);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=certificado.pdf");
      res.setHeader("Content-Length", pdfBuffer.length);

      return res.send(pdfBuffer);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao exibir certificado público" });
    }
  }
}

export default CertificateController;
