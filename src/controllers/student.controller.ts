
import { Request, Response } from "express";

import {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
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


// Get student by ID controller
export const fetchStudentById = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id;

        // Validate ID type
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        // Validate MongoDB ID format
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        // Find student by ID
        const student = await getStudentById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve student"
        });
    }
};


// Update student controller
export const editStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id;

        if (typeof id !== "string" ||
            !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const {
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address
        } = req.body;

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

        const student = await updateStudent(id, {
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Student update failed"
        });
    }
};

