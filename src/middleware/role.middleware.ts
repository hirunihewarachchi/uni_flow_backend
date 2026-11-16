import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/user.model";

// Map of canonical roles and their aliases
const roleAliases: Record<string, string[]> = {
    ADMIN: ["ADMIN", "SUPER_ADMIN"],
    SUPER_ADMIN: ["ADMIN", "SUPER_ADMIN"],
    MARKETING: ["MARKETING", "MARKETING_OFFICER"],
    MARKETING_OFFICER: ["MARKETING", "MARKETING_OFFICER"],
    ACADEMIC: ["ACADEMIC", "ACADEMIC_OFFICER"],
    ACADEMIC_OFFICER: ["ACADEMIC", "ACADEMIC_OFFICER"],
    EXAM: ["EXAM", "EXAM_OFFICER"],
    EXAM_OFFICER: ["EXAM", "EXAM_OFFICER"],
    FINANCE: ["FINANCE", "FINANCE_OFFICER"],
    FINANCE_OFFICER: ["FINANCE", "FINANCE_OFFICER"],
    LECTURER: ["LECTURER"],
    STUDENT: ["STUDENT"]
};

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: (UserRole | string)[]) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        // Check whether the user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const userRole = req.user.role;

        // Admin has access to all management operations
        if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
            return next();
        }

        // Check if user's role matches any allowed role or its aliases
        const isAuthorized = allowedRoles.some((role) => {
            const aliases = roleAliases[role] || [role];
            return aliases.includes(userRole);
        });

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};
