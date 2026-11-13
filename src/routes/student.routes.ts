
import { Router } from "express";
import { createStudent } from "../controllers/student.controller";
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

export default router;
