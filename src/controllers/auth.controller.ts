import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    firstLoginPasswordChange,
    changePassword,
    forgotPassword,
    resetPasswordWithCode
} from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import User, { UserRole } from "../models/user.model";

// Register controller
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const result = await registerUser({
            firstName,
            lastName,
            email,
            password,
            phone,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Registration failed"
        });
    }
};

// Login controller (accepts email or institutional login identifier)
export const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.email || req.body.identifier || req.body.username;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Login identifier and password are required"
            });
        }

        const result = await loginUser(email, password);

        // Also return token at top level for compatibility with any existing frontend callers
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user,
            data: result
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Login failed"
        });
    }
};

// Get authenticated user details
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
                studentId: user.studentId
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user details"
        });
    }
};

// First login password change
export const handleFirstLoginPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const result = await firstLoginPasswordChange(req.user!.userId, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Password change failed"
        });
    }
};

// Change password
export const handleChangePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both old and new passwords"
            });
        }

        const result = await changePassword(req.user!.userId, oldPassword, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Password change failed"
        });
    }
};

// Forgot password controller - accepts email or login identifier (e.g. institutionalId)
export const handleForgotPassword = async (req: Request, res: Response) => {
    try {
        const identifier = req.body.email || req.body.identifier || req.body.username;
        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: "Email or login identifier is required"
            });
        }

        const result = await forgotPassword(identifier);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Forgot password failed"
        });
    }
};

// Reset password with recovery code controller
export const handleResetPasswordWithCode = async (req: Request, res: Response) => {
    try {
        const identifier = req.body.email || req.body.identifier || req.body.username;
        const { code, newPassword } = req.body;

        if (!identifier || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Identifier, recovery code, and new password are required"
            });
        }

        const result = await resetPasswordWithCode(identifier, code, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Password reset failed"
        });
    }
};

