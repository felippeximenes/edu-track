import { prisma } from "../lib/prisma";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto";

export class CourseService {
  async createCourse(instructorId: number, data: CreateCourseDTO) {
    return prisma.course.create({
      data: {
        ...data,
        instructorId,
      },
    });
  }

  async getAllCourses() {
    return prisma.course.findMany({
      include: {
        instructor: true,
        lessons: true,
        modules: true,
      },
    });
  }

  async getCourseById(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        lessons: true,
        modules: true,
      },
    });
  }

  async updateCourse(id: number, instructorId: number, data: UpdateCourseDTO) {
    return prisma.course.update({
      where: {
        id,
        instructorId, // só o instrutor dono do curso pode atualizar
      },
      data,
    });
  }

  async deleteCourse(id: number, instructorId: number) {
    return prisma.course.delete({
      where: {
        id,
        instructorId,
      },
    });
  }
}
