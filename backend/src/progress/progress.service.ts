import prisma from "../config/prismaClient";

export class ProgressService {
  async complete(userId: number, lessonId: number) {
    return prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
      },
    });
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

    return {
      courseId,
      completedLessons,
      totalLessons,
      progressPercentage,
      modules: modules.map((m) => ({
        moduleId: m.id,
        title: m.title,
        completedLessons: m.lessons.filter(
          (l) => l.progress.length > 0
        ).length,
        totalLessons: m.lessons.length,
      })),
    };
  }
}
