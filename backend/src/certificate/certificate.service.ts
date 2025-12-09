import prisma from "../config/prismaClient";
import crypto from "crypto";

export class CertificateService {
  async hasCompletedCourse(userId: number, courseId: number) {
    const totalLessons = await prisma.lesson.count({
      where: { courseId }
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { courseId }
      }
    });

    return completedLessons === totalLessons;
  }

  async issueCertificate(userId: number, courseId: number) {
    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId }
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
        code
      }
    });
  }

  async getCertificatesByUser(userId: number) {
    return prisma.certificate.findMany({
      where: { userId },
      include: { course: true }
    });
  }

  async getUserCertificateForCourse(userId: number, courseId: number) {
    return prisma.certificate.findFirst({
      where: { userId, courseId },
      include: { course: true }
    });
  }
}
