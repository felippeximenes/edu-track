import { Request, Response } from "express";
import { ProgressService } from "./progress.service";

const progressService = new ProgressService();

export class ProgressController {
  async complete(req: Request, res: Response) {
    try {
      // depende do seu authMiddleware – use o que você já usa no resto:
      const userId = (req as any).user.id; // ou req.user.id se for o caso
      const { lessonId } = req.body;

      if (!lessonId) {
        return res.status(400).json({ error: "lessonId is required" });
      }

      const progress = await progressService.complete(userId, lessonId);
      return res.status(201).json(progress);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to mark lesson as completed" });
    }
  }

  async getLessonProgress(req: Request, res: Response) {
    try {
      const userId   = (req as any).user.id;
      const lessonId = Number(req.params.lessonId);
      if (isNaN(lessonId)) return res.status(400).json({ error: "Invalid lessonId" });
      const completed = await progressService.isLessonCompleted(userId, lessonId);
      return res.json({ completed });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch lesson progress" });
    }
  }

  async getCourseProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // mesmo esquema do de cima
      const courseId = Number(req.params.courseId);

      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid courseId" });
      }

      const data = await progressService.getCourseProgress(userId, courseId);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch course progress" });
    }
  }
}
