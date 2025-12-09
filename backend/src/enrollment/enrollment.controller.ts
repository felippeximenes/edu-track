import { Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { enrollSchema } from "./enrollment.dto";

const enrollmentService = new EnrollmentService();

export class EnrollmentController {
  async enroll(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const data = enrollSchema.parse(req.body);

      const enrollment = await enrollmentService.enroll(user.id, data);

      return res.status(201).json(enrollment);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const result = await enrollmentService.getEnrollmentsByUser(userId);
    return res.json(result);
  }

  async getByCourse(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    const result = await enrollmentService.getEnrollmentsByCourse(courseId);
    return res.json(result);
  }
}
