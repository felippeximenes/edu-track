import { z } from "zod";

export const enrollSchema = z.object({
  courseId: z.number(),
});

export type EnrollDTO = z.infer<typeof enrollSchema>;
