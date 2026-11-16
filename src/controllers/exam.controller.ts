import { Request, Response } from "express";
import {
    createExamination,
    getExaminations,
    enterStudentMarks,
    togglePublishResults,
    getStudentPublishedResults,
    getAllResults
} from "../services/exam.service";
import { AuthRequest } from "../middleware/auth.middleware";
import Student from "../models/student.model";
import User from "../models/user.model";

// Examinations
export const handleCreateExam = async (req: Request, res: Response) => {
    try {
        const exam = await createExamination(req.body);
        return res.status(201).json({
            success: true,
            message: "Examination created successfully",
            data: exam
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create examination"
        });
    }
};

export const handleGetExams = async (req: Request, res: Response) => {
    try {
        const { batchNumber } = req.query;
        const exams = await getExaminations(batchNumber as string);
        return res.status(200).json({
            success: true,
            data: exams
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve examinations"
        });
    }
};

// Marks entry
export const handleEnterMarks = async (req: AuthRequest, res: Response) => {
    try {
        const result = await enterStudentMarks({
            ...req.body,
            modifiedBy: req.user?.userId
        });
        return res.status(200).json({
            success: true,
            message: "Marks recorded successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to record marks"
        });
    }
};

// Publish / Unpublish results
export const handlePublishResults = async (req: Request, res: Response) => {
    try {
        const { examinationId, batchNumber, subject, publish } = req.body;
        const result = await togglePublishResults(
            { examinationId, batchNumber, subject },
            publish !== undefined ? publish : true
        );
        return res.status(200).json({
            success: true,
            message: publish ? "Results published successfully" : "Results unpublished",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update publication status"
        });
    }
};

// Student view: Only published results of the authenticated student
export const handleGetMyResults = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find student record using user._id or user.studentId
        const student = await Student.findOne({
            $or: [{ userId: user._id }, { studentId: user.studentId }, { email: user.email }, { institutionalId: user.email }]
        });

        const targetStudentId = student ? (student.studentId || student.registrationNumber) : user.studentId;

        if (!targetStudentId) {
            return res.status(200).json({ success: true, data: [] });
        }

        const results = await getStudentPublishedResults(targetStudentId);
        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve student results"
        });
    }
};

// Officer / Admin view: All results
export const handleGetAllResults = async (req: Request, res: Response) => {
    try {
        const { batchNumber, subject, studentId } = req.query;
        const results = await getAllResults({
            batchNumber: batchNumber as string,
            subject: subject as string,
            studentId: studentId as string
        });
        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve results"
        });
    }
};
