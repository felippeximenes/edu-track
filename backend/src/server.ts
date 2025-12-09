import express from "express";
import cors from "cors";

// Importação das rotas
import authRoutes from "./auth/auth.routes";
import courseRoutes from "./courses/course.routes";
import lessonRoutes from "./lessons/lesson.routes";
import moduleRoutes from "./modules/module.routes";
import enrollmentRoutes from "./enrollment/enrollment.routes";
import progressRoutes from "./progress/progress.routes";
import certificateRoutes from "./certificate/certificate.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/modules", moduleRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/progress", progressRoutes);
app.use("/certificates", certificateRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
