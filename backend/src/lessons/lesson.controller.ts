import { Request, Response } from "express";
import { LessonService } from "./lesson.service";
import { createLessonSchema, updateLessonSchema } from "./lesson.dto";

const lessonService = new LessonService();

export class LessonController {
  async create(req: Request, res: Response) {
    try {
      const instructor = (req as any).user;
      const data = createLessonSchema.parse(req.body);

      const lesson = await lessonService.createLesson(data, instructor.id);
      return res.status(201).json(lesson);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listByModule(req: Request, res: Response) {
    const moduleId = Number(req.params.moduleId);
    const lessons = await lessonService.getLessonsByModule(moduleId);
    return res.json(lessons);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const lesson = await lessonService.getLessonById(id);

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    return res.json(lesson);
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const instructor = (req as any).user;
      const data = updateLessonSchema.parse(req.body);

      const updated = await lessonService.updateLesson(id, data, instructor.id);
      return res.json(updated);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const instructor = (req as any).user;

      await lessonService.deleteLesson(id, instructor.id);
      return res.json({ message: "Lesson deleted" });

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
