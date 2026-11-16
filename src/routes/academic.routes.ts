import { Router } from "express";
import {
    handleCreateBatch,
    handleGetBatches,
    handleGetBatchStudents,
    handleGetCourses,
    handleGetModules,
    handleGetLecturers,
    handleCreateLecturer,
    handleCreateLecture,
    handleGetLectures,
    handleRecordAttendance,
    handleGetAttendance,
    handleGetAttendanceReports
} from "../controllers/academic.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Batches
router.get("/batches", handleGetBatches);
router.post(
    "/batches",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ACADEMIC, UserRole.ACADEMIC_OFFICER),
    handleCreateBatch
);
router.get("/batches/:batchNumber/students", authenticate, handleGetBatchStudents);

// Courses & Modules
router.get("/courses", handleGetCourses);
router.get("/courses/:courseCode/modules", handleGetModules);

// Lecturers
router.get("/lecturers", handleGetLecturers);
router.post(
    "/lecturers",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    handleCreateLecturer
);

// Timetable
router.get("/timetable", handleGetLectures);
router.post(
    "/timetable",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ACADEMIC, UserRole.ACADEMIC_OFFICER),
    handleCreateLecture
);

// Attendance
router.post(
    "/attendance",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ACADEMIC, UserRole.ACADEMIC_OFFICER, UserRole.LECTURER),
    handleRecordAttendance
);
router.get("/attendance/reports", authenticate, handleGetAttendanceReports);
router.get("/attendance/:lectureScheduleId", authenticate, handleGetAttendance);

export default router;
