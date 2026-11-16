import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Legacy endpoints for backwards compatibility
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

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

app.get("/", (req, res) => {
    res.send("Welcome to IJSE UniFlow Backend!");
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`UniFlow server running on port ${PORT}`);
    });
};

startServer();