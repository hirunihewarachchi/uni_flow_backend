
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import admissionRoutes from "./routes/admission.routes";
import academicRoutes from "./routes/academic.routes";
import examRoutes from "./routes/exam.routes";
import lectureRoutes from "./routes/lecture.routes";
import financeRoutes from "./routes/finance.routes";
import aiRoutes from "./routes/ai.routes";
import publicRoutes from "./routes/public.routes";
import adminRoutes from "./routes/admin.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Legacy and direct endpoints
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/ai", aiRoutes);

// Root shortcut endpoints
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Modern v1 API endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/admissions", admissionRoutes);
app.use("/api/v1/admission-requests", admissionRoutes);
app.use("/api/v1/academic", academicRoutes);
app.use("/api/v1/examinations", examRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/lectures", lectureRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Home endpoint
app.get("/", (req, res) => {
    res.send("Welcome to IJSE UniFlow Backend!");
});

export default app;
