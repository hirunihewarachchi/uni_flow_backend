import { Request, Response } from "express";
import {
    analyzeStudentSkillGap,
    toggleAssignmentProgress,
    getStudentCareerRoadmap,
    confirmCareerGoal
} from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middleware";
import Student from "../models/student.model";
import User, { UserRole } from "../models/user.model";

// Skill gap analysis
export const handleGetSkillGap = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if studentId query is passed (allowed for Admin / Officers to inspect student, otherwise default to authenticated student)
        let targetStudentId = req.query.studentId as string;

        if (!targetStudentId || user.role === UserRole.STUDENT) {
            const student = await Student.findOne({
                $or: [{ userId: user._id }, { studentId: user.studentId }, { email: user.email }, { institutionalId: user.email }]
            });
            targetStudentId = student ? (student.studentId || student.registrationNumber) : (user.studentId || "HDSE75-00001");
        }

        const result = await analyzeStudentSkillGap(targetStudentId);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to generate Skill Gap Analysis"
        });
    }
};

// Toggle assignment
export const handleToggleAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { studentId, assignmentId } = req.body;
        if (!studentId || !assignmentId) {
            return res.status(400).json({ success: false, message: "Missing studentId or assignmentId" });
        }

        const result = await toggleAssignmentProgress(studentId, assignmentId);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to toggle assignment"
        });
    }
};

// Career roadmap
export const handleGetCareerRoadmap = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let targetStudentId = req.query.studentId as string;

        if (!targetStudentId || user.role === UserRole.STUDENT) {
            const student = await Student.findOne({
                $or: [{ userId: user._id }, { studentId: user.studentId }, { email: user.email }, { institutionalId: user.email }]
            });
            targetStudentId = student ? (student.studentId || student.registrationNumber) : (user.studentId || "HDSE75-00001");
        }

        const result = await getStudentCareerRoadmap(targetStudentId);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to generate Career Roadmap"
        });
    }
};

// Confirm career goal
export const handleConfirmCareer = async (req: AuthRequest, res: Response) => {
    try {
        const { studentId, careerId } = req.body;
        if (!studentId || !careerId) {
            return res.status(400).json({ success: false, message: "Missing studentId or careerId" });
        }

        const result = await confirmCareerGoal(studentId, careerId);
        return res.status(200).json({
            success: true,
            message: "Career goal confirmed successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to confirm career goal"
        });
    }
};
