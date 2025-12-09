import { z } from "zod";

export const progressSchema = z.object({
  lessonId: z.number(),
});

export type ProgressDTO = z.infer<typeof progressSchema>;
