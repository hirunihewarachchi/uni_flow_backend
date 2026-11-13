
import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/user.model";

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: UserRole[]) => {

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

        // Check whether the user has permission
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};
