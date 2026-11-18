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
import User, { UserRole } from "../models/user.model";
import Batch from "../models/batch.model";
import Examination from "../models/examination.model";

// Examinations
export const handleCreateExam = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const exam = await createExamination({
            batchNumber: body.batchNumber,
            subject: body.subject || body.moduleName || (body.moduleCode ? `${body.courseCode ? body.courseCode + " - " : ""}${body.moduleCode}` : "Examination"),
            examType: body.examType || body.type || "Final Examination",
            date: body.date,
            startTime: body.startTime || (body.time ? body.time.split("-")[0]?.trim() : "09:00 AM"),
            endTime: body.endTime || (body.time && body.time.includes("-") ? body.time.split("-")[1]?.trim() : "12:00 PM"),
            venue: body.venue || body.hall || "Main Examination Hall",
            duration: body.duration || "3 Hours"
        });
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
        const authReq = req as AuthRequest;
        let { batchNumber } = req.query;

        // Dynamic distinct batches
        const batchDocs = await Batch.find().select("batchNumber").lean();
        const examBatches = await Examination.distinct("batchNumber");
        const availableBatches = Array.from(new Set([
            ...batchDocs.map(b => b.batchNumber),
            ...examBatches
        ].filter(Boolean)));

        // If authenticated as student, strictly lock to student's own batch
        if (authReq.user && authReq.user.role === UserRole.STUDENT) {
            let student = await Student.findOne({ userId: authReq.user.userId });
            if (!student) {
                const user = await User.findById(authReq.user.userId);
                if (user) {
                    student = await Student.findOne({
                        $or: [
                            { email: user.email },
                            { institutionalId: user.email },
                            ...(user.studentId ? [{ studentId: user.studentId }] : [])
                        ]
                    });
                    if (student && !student.batchNumber && user.batchNumber) {
                        student.batchNumber = user.batchNumber;
                    }
                }
            }

            const studentBatch = student?.batchNumber;
            if (!studentBatch) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    batchNumber: "UNASSIGNED",
                    availableBatches
                });
            }

            const exams = await getExaminations(studentBatch);
            return res.status(200).json({
                success: true,
                data: exams,
                batchNumber: studentBatch,
                availableBatches
            });
        }

        // Staff / Admin / Public view
        const exams = await getExaminations(batchNumber as string);
        return res.status(200).json({
            success: true,
            data: exams,
            batchNumber: batchNumber || "ALL",
            availableBatches
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
        const body = req.body;
        const publish = body.publish !== undefined ? body.publish : (body.isPublished !== undefined ? body.isPublished : true);

        // Bulk batch marks entry
        if (Array.isArray(body.records) || Array.isArray(body.marks)) {
            const list = body.records || body.marks;
            const savedResults = [];

            for (const item of list) {
                const r = await enterStudentMarks({
                    examinationId: body.examinationId || item.examinationId,
                    studentId: item.studentId,
                    studentName: item.studentName || item.name || "Student",
                    batchNumber: body.batchNumber || item.batchNumber || "HDSE-75",
                    subject: body.subject || item.subject || body.moduleName || "Examination",
                    moduleCode: body.moduleCode || item.moduleCode,
                    semester: body.semester || item.semester || "Semester 1",
                    examType: body.examType || item.examType || "Final Examination",
                    examDate: body.examDate || item.examDate || new Date().toISOString().slice(0, 10),
                    marks: Number(item.marks ?? item.score ?? 0),
                    modifiedBy: req.user?.userId,
                    isPublished: publish
                });
                savedResults.push(r);
            }

            return res.status(200).json({
                success: true,
                message: "Batch examination marks recorded successfully",
                data: savedResults
            });
        }

        const result = await enterStudentMarks({
            ...body,
            isPublished: publish,
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

        const studentIds = Array.from(new Set([
            student?.studentId,
            student?.registrationNumber,
            user?.studentId
        ].filter(Boolean) as string[]));

        if (studentIds.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const results = await getStudentPublishedResults(studentIds);
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
