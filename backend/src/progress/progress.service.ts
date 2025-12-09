import { prisma } from "../lib/prisma";
import { ProgressDTO } from "./progress.dto";

export class ProgressService {
  async markLessonCompleted(userId: number, data: ProgressDTO) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
      include: {
        module: true,
        course: true,
      },
    });

    if (!lesson) throw new Error("Lesson not found");

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: lesson.courseId,
      },
    });

    if (!enrollment)
      throw new Error("User is not enrolled in this course");

    // Prevent duplicate progress
    const existing = await prisma.lessonProgress.findFirst({
      where: {
        userId,
        lessonId: data.lessonId,
      },
    });

    if (existing) return existing;

    return prisma.lessonProgress.create({
      data: {
        userId,
        lessonId: data.lessonId,
      },
    });
  }

  async getCourseProgress(userId: number, courseId: number) {
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          include: {
            progresses: {
              where: { userId },
            },
          },
        },
      },
    });

    const allLessons = modules.flatMap((m) => m.lessons);

    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter(
      (l) => l.progresses.length > 0
    ).length;

    const coursePercentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    const modulesProgress = modules.map((module) => {
      const total = module.lessons.length;
      const done = module.lessons.filter((l) => l.progresses.length > 0).length;

      return {
        moduleId: module.id,
        moduleTitle: module.title,
        totalLessons: total,
        completedLessons: done,
        percentage: total === 0 ? 0 : Math.round((done / total) * 100),
      };
    });

    return {
      courseId,
      totalLessons,
      completedLessons,
      percentage: coursePercentage,
      modules: modulesProgress,
    };
  }
}
