import { Router } from "express";
import {
    register,
    login,
    getMe,
    handleFirstLoginPassword,
    handleChangePassword,
    handleForgotPassword,
    handleResetPasswordWithCode
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPasswordWithCode);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/first-login-password", authenticate, handleFirstLoginPassword);
router.post("/change-password", authenticate, handleChangePassword);

export default router;
