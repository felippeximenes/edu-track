import { prisma } from "../lib/prisma";
import { CreateLessonDTO, UpdateLessonDTO } from "./lesson.dto";

export class LessonService {
  async createLesson(data: CreateLessonDTO, instructorId: number) {
    const moduleData = await prisma.module.findUnique({
      where: { id: data.moduleId },
      include: { course: true },
    });

    if (!moduleData) throw new Error("Module not found");

    if (moduleData.course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.lesson.create({
      data: {
        title: data.title,
        content: data.content,
        videoUrl: data.videoUrl,
        courseId: moduleData.courseId,
        moduleId: data.moduleId,
      },
    });
  }

  async getLessonsByModule(moduleId: number) {
    return prisma.lesson.findMany({
      where: { moduleId },
    });
  }

  async getLessonById(id: number) {
    return prisma.lesson.findUnique({
      where: { id },
    });
  }

  async updateLesson(id: number, data: UpdateLessonDTO, instructorId: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!lesson) throw new Error("Lesson not found");
    if (lesson.course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async deleteLesson(id: number, instructorId: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!lesson) throw new Error("Lesson not found");
    if (lesson.course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.lesson.delete({
      where: { id },
    });
  }
}
