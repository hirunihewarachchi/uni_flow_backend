import { Router } from "express";
import {
    handleCreateExam,
    handleGetExams,
    handleEnterMarks,
    handlePublishResults,
    handleGetMyResults,
    handleGetAllResults
} from "../controllers/exam.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Student-accessible endpoint for personal published results
router.get("/my-results", authenticate, handleGetMyResults);

// Exam schedules (Accessible to authenticated users and students viewing their batch exams)
router.get("/timetable", optionalAuthenticate, handleGetExams);
router.post(
    "/timetable",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EXAM, UserRole.EXAM_OFFICER),
    handleCreateExam
);

// Marks entry and management (Exam department & Admin)
router.post(
    "/marks",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EXAM, UserRole.EXAM_OFFICER),
    handleEnterMarks
);

router.post(
    "/publish",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EXAM, UserRole.EXAM_OFFICER),
    handlePublishResults
);

router.get(
    "/all-results",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EXAM, UserRole.EXAM_OFFICER, UserRole.ACADEMIC, UserRole.ACADEMIC_OFFICER),
    handleGetAllResults
);

export default router;
