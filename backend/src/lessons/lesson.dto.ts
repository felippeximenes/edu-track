import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  videoUrl: z.string().url().optional(),
  moduleId: z.number(), // OBRIGATÓRIO
});

export const updateLessonSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  videoUrl: z.string().url().optional(),
  moduleId: z.number().optional(),
});

export type CreateLessonDTO = z.infer<typeof createLessonSchema>;
export type UpdateLessonDTO = z.infer<typeof updateLessonSchema>;
