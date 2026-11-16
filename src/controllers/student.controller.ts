import { Request, Response } from "express";
import {
    registerStudent,
    registerStudentByMarketing,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../services/student.service";
import { AuthRequest } from "../middleware/auth.middleware";

// Register student controller (Existing endpoint)
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
            address,
            courseCode,
            batchNumber
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
            address,
            courseCode,
            batchNumber
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

// Marketing Student Registration (Auto generates HDSE75-12345 ID and student,batch@ijse.com email)
export const createMarketingStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phone = req.body.phone;
        const course = req.body.course || req.body.courseCode;
        const batch = req.body.batch || req.body.batchNumber;
        const address = req.body.address;
        const admissionRequestId = req.body.admissionRequestId;

        if (!firstName || !lastName || !email || !phone || !course || !batch) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details (first name, last name, email, phone, course, batch)"
            });
        }

        const result = await registerStudentByMarketing({
            firstName,
            lastName,
            email,
            phone,
            course,
            batch,
            address,
            admissionRequestId
        });

        return res.status(201).json({
            success: true,
            message: `Student registered successfully with ID ${result.credentials.studentId}`,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Student registration failed"
        });
    }
};

// Get all registered students
export const fetchAllStudents = async (
    req: Request,
    res: Response
) => {
    try {
        const { courseCode, batchNumber, search } = req.query;

        const students = await getAllStudents({
            courseCode: courseCode as string,
            batchNumber: batchNumber as string,
            search: search as string
        });

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

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Student ID parameter is required"
            });
        }

        // Find student by ID or studentId
        const student = await getStudentById(id as string);

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

        const {
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address,
            courseCode,
            batchNumber,
            status
        } = req.body;

        const student = await updateStudent(id as string, {
            registrationNumber,
            firstName,
            lastName,
            email,
            phone,
            address,
            courseCode,
            batchNumber,
            status
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

// Delete student controller
export const removeStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id;

        // Delete student
        const student = await deleteStudent(id as string);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete student"
        });
    }
};
