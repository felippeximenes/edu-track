import prisma from "../config/prismaClient";
import crypto from "crypto";
import puppeteer from "puppeteer";
import { certificateHTML } from "./certificateTemplate";
import QRCode from "qrcode";

export class CertificateService {

  async hasCompletedCourse(userId: number, courseId: number) {
    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { courseId },
      },
    });

    return completedLessons === totalLessons;
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

  // 🔥 Gerar PDF com QR code
  async generateCertificatePDF(certificateId: number) {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { user: true, course: true },
    });

    if (!certificate) throw new Error("Certificado não encontrado.");

    // URL pública
    const publicUrl = `http://localhost:3001/certificates/public/${certificate.code}`;

    // QR Code base64
    const qrCodeDataURL = await QRCode.toDataURL(publicUrl);

    // HTML com QR Code
    const html = certificateHTML({
      student: certificate.user.name,
      course: certificate.course.title,
      date: certificate.issuedAt.toLocaleDateString("pt-BR"),
      code: certificate.code,
      qr: qrCodeDataURL, // agora válido!
    });

    const browser = await puppeteer.launch({
      headless: true, // compatível com sua versão
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  }
}
