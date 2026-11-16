import mongoose, { Schema, Document } from "mongoose";

export interface IResultAudit {
    modifiedBy: mongoose.Types.ObjectId;
    previousMarks: number;
    newMarks: number;
    reason: string;
    date: Date;
}

export interface IExaminationResult extends Document {
    examinationId?: mongoose.Types.ObjectId;
    studentId: string;
    studentName: string;
    batchNumber: string;
    subject: string;
    moduleCode?: string; // e.g. "PRF", "OOP", "DBMS"
    semester?: string;
    examType: string;
    examDate: string;
    marks: number;
    totalMarks: number;
    grade: string;
    status: "Passed" | "Failed" | "Pending";
    isPublished: boolean;
    publishedAt?: Date;
    auditHistory: IResultAudit[];
}

const examinationResultSchema = new Schema<IExaminationResult>(
    {
        examinationId: {
            type: Schema.Types.ObjectId,
            ref: "Examination"
        },
        studentId: {
            type: String,
            required: true,
            trim: true
        },
        studentName: {
            type: String,
            required: true,
            trim: true
        },
        batchNumber: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        moduleCode: {
            type: String,
            trim: true
        },
        semester: {
            type: String,
            trim: true
        },
        examType: {
            type: String,
            default: "Final Examination",
            trim: true
        },
        examDate: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        totalMarks: {
            type: Number,
            default: 100
        },
        grade: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Passed", "Failed", "Pending"],
            default: "Passed"
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date
        },
        auditHistory: [
            {
                modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
                previousMarks: Number,
                newMarks: Number,
                reason: String,
                date: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Compound index on studentId + subject + examType
examinationResultSchema.index({ studentId: 1, subject: 1, examType: 1 }, { unique: true });

const ExaminationResult = mongoose.model<IExaminationResult>("ExaminationResult", examinationResultSchema);
export default ExaminationResult;
