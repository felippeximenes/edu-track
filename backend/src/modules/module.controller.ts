import { Request, Response } from "express";
import { ModuleService } from "./module.service";
import { createModuleSchema, updateModuleSchema } from "./module.dto";

const moduleService = new ModuleService();

export class ModuleController {
  async create(req: Request, res: Response) {
    try {
      const instructor = (req as any).user;
      const data = createModuleSchema.parse(req.body);

      const module = await moduleService.createModule(data, instructor.id);
      return res.status(201).json(module);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listByCourse(req: Request, res: Response) {
    const courseId = Number(req.params.courseId);
    const modules = await moduleService.getModulesByCourse(courseId);
    return res.json(modules);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const module = await moduleService.getModuleById(id);

    if (!module) return res.status(404).json({ error: "Module not found" });

    return res.json(module);
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = updateModuleSchema.parse(req.body);
      const instructor = (req as any).user;

      const updated = await moduleService.updateModule(id, data, instructor.id);
      return res.json(updated);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const instructor = (req as any).user;

      await moduleService.deleteModule(id, instructor.id);
      return res.json({ message: "Module deleted" });

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
