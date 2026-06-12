import prisma from "../config/prismaClient";

export class ProgressService {
  async complete(userId: number, lessonId: number) {
    const existing = await prisma.lessonProgress.findFirst({ where: { userId, lessonId } });
    if (existing) return existing;
    return prisma.lessonProgress.create({ data: { userId, lessonId } });
  }

  async isLessonCompleted(userId: number, lessonId: number): Promise<boolean> {
    const record = await prisma.lessonProgress.findFirst({ where: { userId, lessonId } });
    return !!record;
  }

  async getCourseProgress(userId: number, courseId: number) {
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    const totalLessons = modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );

    const completedLessons = modules.reduce(
      (sum, m) =>
        sum + m.lessons.filter((l) => l.progress.length > 0).length,
      0
    );

    const progressPercentage =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    const completedLessonIds = modules
      .flatMap((m) => m.lessons)
      .filter((l) => l.progress.length > 0)
      .map((l) => l.id);

    return {
      courseId,
      completedLessons,
      totalLessons,
      progressPercentage,
      completedLessonIds,
      modules: modules.map((m) => ({
        moduleId: m.id,
        title: m.title,
        completedLessons: m.lessons.filter((l) => l.progress.length > 0).length,
        totalLessons: m.lessons.length,
      })),
    };
  }
}
