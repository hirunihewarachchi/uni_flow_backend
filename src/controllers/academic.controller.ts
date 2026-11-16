import { Request, Response } from "express";
import {
    createBatch,
    getAllBatches,
    getStudentsByBatch,
    getAllCourses,
    getModulesByCourse,
    getAllLecturers,
    createLecturer,
    createLectureSession,
    getLectureSchedules,
    recordBatchAttendance,
    getBatchAttendanceForLecture,
    getAttendanceReports
} from "../services/academic.service";
import { AuthRequest } from "../middleware/auth.middleware";

// Batches
export const handleCreateBatch = async (req: Request, res: Response) => {
    try {
        const batch = await createBatch(req.body);
        return res.status(201).json({
            success: true,
            message: "Batch created successfully",
            data: batch
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create batch"
        });
    }
};

export const handleGetBatches = async (req: Request, res: Response) => {
    try {
        const batches = await getAllBatches();
        return res.status(200).json({
            success: true,
            data: batches
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve batches"
        });
    }
};

export const handleGetBatchStudents = async (req: Request, res: Response) => {
    try {
        const { batchNumber } = req.params;
        const students = await getStudentsByBatch(batchNumber as string);
        return res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve students for batch"
        });
    }
};

// Courses & Modules
export const handleGetCourses = async (req: Request, res: Response) => {
    try {
        const courses = await getAllCourses();
        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve courses"
        });
    }
};

export const handleGetModules = async (req: Request, res: Response) => {
    try {
        const { courseCode } = req.params;
        const modules = await getModulesByCourse(courseCode as string);
        return res.status(200).json({
            success: true,
            data: modules
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve modules"
        });
    }
};

// Lecturers
export const handleGetLecturers = async (req: Request, res: Response) => {
    try {
        const lecturers = await getAllLecturers();
        return res.status(200).json({
            success: true,
            data: lecturers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve lecturers"
        });
    }
};

export const handleCreateLecturer = async (req: Request, res: Response) => {
    try {
        const result = await createLecturer(req.body);
        return res.status(201).json({
            success: true,
            message: "Lecturer created successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create lecturer"
        });
    }
};

// Timetable
export const handleCreateLecture = async (req: Request, res: Response) => {
    try {
        const lecture = await createLectureSession(req.body);
        return res.status(201).json({
            success: true,
            message: "Lecture session scheduled successfully",
            data: lecture
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to schedule lecture session"
        });
    }
};

export const handleGetLectures = async (req: Request, res: Response) => {
    try {
        const { batchNumber } = req.query;
        const schedules = await getLectureSchedules(batchNumber as string);
        return res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve timetable"
        });
    }
};

// Attendance
export const handleRecordAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { lectureScheduleId, batchNumber, date, records } = req.body;
        if (!lectureScheduleId || !batchNumber || !records) {
            return res.status(400).json({
                success: false,
                message: "Missing attendance details"
            });
        }

        const result = await recordBatchAttendance(
            lectureScheduleId,
            batchNumber,
            date || new Date().toISOString().slice(0, 10),
            records,
            req.user?.userId
        );

        return res.status(200).json({
            success: true,
            message: "Attendance recorded successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to record attendance"
        });
    }
};

export const handleGetAttendance = async (req: Request, res: Response) => {
    try {
        const { lectureScheduleId } = req.params;
        const attendance = await getBatchAttendanceForLecture(lectureScheduleId as string);
        return res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance"
        });
    }
};

export const handleGetAttendanceReports = async (req: Request, res: Response) => {
    try {
        const { batchNumber } = req.query;
        const report = await getAttendanceReports(batchNumber as string);
        return res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate attendance report"
        });
    }
};
