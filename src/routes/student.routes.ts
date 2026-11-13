
import { Router } from "express";
import { createStudent, fetchAllStudents } from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Register a new student
router.post(
    "/",
    authenticate,
    authorizeRoles(
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING_OFFICER
    ),
    createStudent
);

// get all registered students

router.get(
    "/",
    authenticate,
    authorizeRoles(
        UserRole.SUPER_ADMIN,
        UserRole.MARKETING_OFFICER
    ),
    fetchAllStudents
);

export default router;
