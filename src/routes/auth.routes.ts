
import { Router } from "express";
import {
    register,
    login,
    getMe
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);

// Admin-only test route
router.get(
    "/admin-test",
    authenticate,
    authorizeRoles(UserRole.SUPER_ADMIN),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome, Super Admin!"
        });
    }
);

export default router;
