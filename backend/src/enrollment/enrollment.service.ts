import { prisma } from "../lib/prisma";
import { EnrollDTO } from "./enrollment.dto";

export class EnrollmentService {
  async enroll(userId: number, data: EnrollDTO) {
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) throw new Error("Course not found");

    if (course.instructorId === userId)
      throw new Error("Instructors cannot enroll in their own course");

    const existing = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: data.courseId,
      },
    });

    if (existing) throw new Error("User is already enrolled in this course");

    return prisma.enrollment.create({
      data: {
        userId,
        courseId: data.courseId,
      },
    });
  }

  async getEnrollmentsByUser(userId: number) {
    return prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  async getEnrollmentsByCourse(courseId: number) {
    return prisma.enrollment.findMany({
      where: { courseId },
      include: { user: true },
    });
  }
}
