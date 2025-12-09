import { prisma } from "../lib/prisma";
import { CreateModuleDTO, UpdateModuleDTO } from "./module.dto";

export class ModuleService {
  async createModule(data: CreateModuleDTO, instructorId: number) {
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) throw new Error("Course not found");

    if (course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.module.create({
      data: {
        title: data.title,
        courseId: data.courseId,
      },
    });
  }

  async getModulesByCourse(courseId: number) {
    return prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: true,
      },
    });
  }

  async getModuleById(id: number) {
    return prisma.module.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });
  }

  async updateModule(id: number, data: UpdateModuleDTO, instructorId: number) {
    const module = await prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!module) throw new Error("Module not found");
    if (module.course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.module.update({
      where: { id },
      data,
    });
  }

  async deleteModule(id: number, instructorId: number) {
    const module = await prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!module) throw new Error("Module not found");
    if (module.course.instructorId !== instructorId) {
      throw new Error("You are not the instructor of this course");
    }

    return prisma.module.delete({
      where: { id },
    });
  }
}
