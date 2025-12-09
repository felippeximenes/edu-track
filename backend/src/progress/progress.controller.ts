import { Request, Response } from "express";
import { progressSchema } from "./progress.dto";
import { ProgressService } from "./progress.service";

const progressService = new ProgressService();

export class ProgressController {
  async complete(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const data = progressSchema.parse(req.body);

      const result = await progressService.markLessonCompleted(
        user.id,
        data
      );

      return res.status(201).json(result);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getCourseProgress(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const courseId = Number(req.params.courseId);

      const result = await progressService.getCourseProgress(
        user.id,
        courseId
      );

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
