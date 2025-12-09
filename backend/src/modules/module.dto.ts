import { z } from "zod";

export const createModuleSchema = z.object({
  title: z.string().min(3),
  courseId: z.number(),
});

export const updateModuleSchema = z.object({
  title: z.string().min(3).optional(),
});

export type CreateModuleDTO = z.infer<typeof createModuleSchema>;
export type UpdateModuleDTO = z.infer<typeof updateModuleSchema>;
