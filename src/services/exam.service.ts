import Examination, { IExamination } from "../models/examination.model";
import ExaminationResult, { IExaminationResult } from "../models/result.model";
import { calculateGrade } from "../utils/gradeCalculator";

// Create examination schedule
export const createExamination = async (data: {
    batchNumber: string;
    subject: string;
    examType: string;
    date: string;
    startTime: string;
    endTime: string;
    duration?: string;
    venue: string;
}) => {
    return await Examination.create({
        ...data,
        status: "Upcoming",
        isPublished: false
    });
};

// Get examinations by batch or all
export const getExaminations = async (batchNumber?: string) => {
    const query: any = {};
    if (batchNumber && batchNumber !== "All" && batchNumber !== "ALL") {
        query.batchNumber = batchNumber;
    }
    return await Examination.find(query).sort({ date: 1, startTime: 1 });
};

// Enter or update student marks
export const enterStudentMarks = async (data: {
    examinationId?: string;
    studentId: string;
    studentName: string;
    batchNumber: string;
    subject: string;
    moduleCode?: string;
    semester?: string;
    examType?: string;
    examDate: string;
    marks: number;
    modifiedBy?: string;
    reason?: string;
}) => {
    const { grade, status } = calculateGrade(data.marks);

    const existingResult = await ExaminationResult.findOne({
        studentId: data.studentId,
        subject: data.subject,
        examType: data.examType || "Final Examination"
    });

    if (existingResult) {
        // Log to audit history
        existingResult.auditHistory.push({
            modifiedBy: data.modifiedBy as any,
            previousMarks: existingResult.marks,
            newMarks: data.marks,
            reason: data.reason || "Score correction",
            date: new Date()
        });

        existingResult.marks = data.marks;
        existingResult.grade = grade;
        existingResult.status = status;
        return await existingResult.save();
    }

    return await ExaminationResult.create({
        examinationId: data.examinationId,
        studentId: data.studentId,
        studentName: data.studentName,
        batchNumber: data.batchNumber,
        subject: data.subject,
        moduleCode: data.moduleCode,
        semester: data.semester,
        examType: data.examType || "Final Examination",
        examDate: data.examDate,
        marks: data.marks,
        totalMarks: 100,
        grade,
        status,
        isPublished: false
    });
};

// Publish or unpublish examination results
export const togglePublishResults = async (
    filter: { examinationId?: string; batchNumber?: string; subject?: string },
    publish: boolean
) => {
    const query: any = {};
    if (filter.examinationId) query.examinationId = filter.examinationId;
    if (filter.batchNumber) query.batchNumber = filter.batchNumber;
    if (filter.subject) query.subject = filter.subject;

    // Update examination if found
    if (filter.examinationId) {
        await Examination.findByIdAndUpdate(filter.examinationId, { isPublished: publish });
    }

    // Update results
    const result = await ExaminationResult.updateMany(
        query,
        {
            isPublished: publish,
            publishedAt: publish ? new Date() : undefined
        }
    );

    return result;
};

// Get results for a student (Only published results are returned for students)
export const getStudentPublishedResults = async (studentId: string) => {
    return await ExaminationResult.find({
        studentId,
        isPublished: true
    }).sort({ examDate: -1 });
};

// Get all results for exam officers / administrators
export const getAllResults = async (filters?: {
    batchNumber?: string;
    subject?: string;
    studentId?: string;
}) => {
    const query: any = {};
    if (filters?.batchNumber && filters.batchNumber !== "All") query.batchNumber = filters.batchNumber;
    if (filters?.subject && filters.subject !== "All") query.subject = filters.subject;
    if (filters?.studentId) query.studentId = filters.studentId;

    return await ExaminationResult.find(query).sort({ examDate: -1 });
};
