import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

router.get(
    "/dashboard",
    authenticate,
    authorizeRoles(UserRole.SUPER_ADMIN),
    // getAdminDashboard
);

export default router;