// src/certificates/certificate.service.ts
import prisma from "../config/prismaClient";
import crypto from "crypto";
import QRCode from "qrcode";
import { generatePdfFromHtml } from "../utils/generatePdf";


import { certificateHTML } from "./certificateTemplate";

export class CertificateService {
  async hasCompletedCourse(userId: number, courseId: number) {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });

    const totalLessons = lessons.length;
    if (totalLessons === 0) return false;

    const completed = await prisma.lessonProgress.groupBy({
      by: ["lessonId"],
      where: {
        userId,
        lessonId: { in: lessons.map((l) => l.id) },
      },
    });

    return completed.length === totalLessons;
  }

  async issueCertificate(userId: number, courseId: number) {
    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    if (existing) return existing;

    const completed = await this.hasCompletedCourse(userId, courseId);
    if (!completed) {
      throw new Error("O curso ainda não foi concluído por esse usuário.");
    }

    const code = crypto.randomBytes(10).toString("hex");

    return prisma.certificate.create({
      data: {
        userId,
        courseId,
        code,
      },
    });
  }

  async getCertificatesByUser(userId: number) {
    return prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  async getUserCertificateForCourse(userId: number, courseId: number) {
    return prisma.certificate.findFirst({
      where: { userId, courseId },
      include: { course: true },
    });
  }

  // 🔥 Rota pública via código do certificado
  async getByCode(code: string) {
    return prisma.certificate.findUnique({
      where: { code },
      include: {
        user: true,
        course: true,
      },
    });
  }

  // 🔥 Gerar PDF com QR code (usando Playwright via helper)
  async generateCertificatePDF(certificateId: number): Promise<Buffer> {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { user: true, course: true },
    });

    if (!certificate) throw new Error("Certificado não encontrado.");

    // Ideal: usar variável de ambiente em vez de localhost fixo
    const baseUrl = process.env.APP_URL || "http://localhost:3001";

    // URL pública que vai no QR Code
    const publicUrl = `${baseUrl}/certificates/public/${certificate.code}`;

    // QR Code em base64 (data:image/png;base64,...)
    const qrCodeDataURL = await QRCode.toDataURL(publicUrl);

    // Monta HTML a partir do template
    const html = certificateHTML({
      student: certificate.user.name,
      course: certificate.course.title,
      date: certificate.issuedAt.toLocaleDateString("pt-BR"),
      code: certificate.code,
      qr: qrCodeDataURL,
    });

    // Gera o PDF a partir do HTML
    const pdfBuffer = await generatePdfFromHtml(html);

    return pdfBuffer;
  }
}
