
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

// Register controller
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const result = await registerUser({
            firstName,
            lastName,
            email,
            password,
            phone
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


// Login controller
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
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
        return res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            data: req.user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user details"
        });
    }
};
