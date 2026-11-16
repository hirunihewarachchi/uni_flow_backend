import { Router } from "express";
import {
    submitAdmission,
    listAdmissions,
    updateStatus
} from "../controllers/admission.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Public: Submit enrollment inquiry
router.post("/", submitAdmission);

// Protected: Marketing and Admin
router.get(
    "/",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MARKETING, UserRole.MARKETING_OFFICER),
    listAdmissions
);

router.patch(
    "/:id/status",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MARKETING, UserRole.MARKETING_OFFICER),
    updateStatus
);

export default router;
