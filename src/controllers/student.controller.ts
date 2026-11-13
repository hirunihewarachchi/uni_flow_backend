
import { Request, Response } from "express";

import {
    registerStudent,
    getAllStudents
} from "../services/student.service";

// Register student controller
export const createStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address
        } = req.body;

        // Validate required fields
        if (
            !registrationNumber ||
            !firstName ||
            !lastName ||
            !email ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required student details"
            });
        }

        const student = await registerStudent({
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address
        });

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            data: student
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Student registration failed"
        });
    }
};

// Get all registered students
export const fetchAllStudents = async (
    req: Request,
    res: Response
) => {
    try {
        const students = await getAllStudents();

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: students
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve students"
        });
    }
};
