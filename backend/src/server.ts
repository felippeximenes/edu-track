import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRoutes from "./auth/auth.routes";
import courseRoutes from "./courses/course.routes";
import lessonRoutes from "./lessons/lesson.routes";
import moduleRoutes from "./modules/module.routes";
import enrollmentRoutes from "./enrollment/enrollment.routes";
import progressRoutes from "./progress/progress.routes";
import certificateRoutes from "./certificate/certificate.routes";
import adminRoutes from "./admin/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/modules", moduleRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/progress", progressRoutes);
app.use("/certificates", certificateRoutes);
app.use("/admin", adminRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
