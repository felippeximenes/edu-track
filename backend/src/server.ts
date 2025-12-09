import express from "express";
import cors from "cors";

import authRoutes from "./auth/auth.routes";
import courseRoutes from "./courses/course.routes";
import lessonRoutes from "./lessons/lesson.routes";
import moduleRoutes from "./modules/module.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/modules", moduleRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));
