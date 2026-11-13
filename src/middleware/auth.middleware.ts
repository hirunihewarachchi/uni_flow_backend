
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../models/user.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Custom request interface
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    };
}

// Authentication middleware
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token not found!"
        });
    }

    // Extract Bearer token
    const token = authHeader.split(" ")[1];

    try {
        // Verify JWT token
        const payload = jwt.verify(token, JWT_SECRET);

        if (
            typeof payload === "string" ||
            !payload.sub ||
            !Object.values(UserRole).includes(payload.role as UserRole)
        ) {
            return res.status(401).json({
                message: "Invalid token payload!"
            });
        }

        // Store authenticated user details
        req.user = {
            userId: payload.sub,
            role: payload.role as UserRole
        };

        // Continue to next middleware or controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token!"
        });
    }
};
