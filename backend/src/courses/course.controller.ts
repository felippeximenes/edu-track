import { Request, Response } from "express";
import { CourseService } from "./course.service";
import { createCourseSchema, updateCourseSchema } from "./course.dto";

const courseService = new CourseService();

export class CourseController {
  async create(req: Request, res: Response) {
    try {
      const instructor = (req as any).user;
      const data = createCourseSchema.parse(req.body);

      const course = await courseService.createCourse(instructor.id, data);

      return res.status(201).json(course);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const courses = await courseService.getAllCourses();
    return res.json(courses);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json(course);
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const instructor = (req as any).user;

      const data = updateCourseSchema.parse(req.body);

      const course = await courseService.updateCourse(id, instructor.id, data);

      return res.json(course);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const instructor = (req as any).user;

      await courseService.deleteCourse(id, instructor.id);

      return res.json({ message: "Course deleted" });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
