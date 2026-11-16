import { Router } from "express";
import {
    createStudent,
    createMarketingStudent,
    fetchAllStudents,
    fetchStudentById,
    editStudent,
    removeStudent
} from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Register a new student (Marketing portal registration with credentials)
router.post(
    "/register",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER
    ),
    createMarketingStudent
);

// Register a new student (Legacy CRUD route)
router.post(
    "/",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER
    ),
    createStudent
);

// Get all registered students
router.get(
    "/",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER,
        UserRole.ACADEMIC,
        UserRole.ACADEMIC_OFFICER,
        UserRole.FINANCE,
        UserRole.FINANCE_OFFICER
    ),
    fetchAllStudents
);

// Get student by ID
router.get(
    "/:id",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER,
        UserRole.ACADEMIC,
        UserRole.ACADEMIC_OFFICER,
        UserRole.FINANCE,
        UserRole.FINANCE_OFFICER,
        UserRole.STUDENT
    ),
    fetchStudentById
);

// Update student details
router.put(
    "/:id",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER
    ),
    editStudent
);

// Delete student
router.delete(
    "/:id",
    authenticate,
    authorizeRoles(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING,
        UserRole.MARKETING_OFFICER
    ),
    removeStudent
);

export default router;
