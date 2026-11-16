import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment {
    id: string;
    title: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    completed: boolean;
}

export interface IModuleGap {
    module: string;
    mark: number;
    level: "Strong" | "Moderate" | "Needs Improvement";
    priority: "High Priority" | "Improvement Needed" | "Satisfactory";
    recommendedFocus: string;
    assignments: IAssignment[];
}

export interface ISkillGap extends Document {
    studentId: string;
    studentName: string;
    batchNumber: string;
    averageMarks: number;
    strongCount: number;
    weakCount: number;
    analysisSummary: string;
    modules: IModuleGap[];
    completedAssignmentIds: string[];
    generatedByAI: boolean;
    analyzedAt: Date;
}

const skillGapSchema = new Schema<ISkillGap>(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
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
        averageMarks: {
            type: Number,
            required: true
        },
        strongCount: {
            type: Number,
            default: 0
        },
        weakCount: {
            type: Number,
            default: 0
        },
        analysisSummary: {
            type: String,
            required: true
        },
        modules: [
            {
                module: String,
                mark: Number,
                level: String,
                priority: String,
                recommendedFocus: String,
                assignments: [
                    {
                        id: String,
                        title: String,
                        description: String,
                        difficulty: String,
                        duration: String,
                        completed: { type: Boolean, default: false }
                    }
                ]
            }
        ],
        completedAssignmentIds: {
            type: [String],
            default: []
        },
        generatedByAI: {
            type: Boolean,
            default: true
        },
        analyzedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const SkillGap = mongoose.model<ISkillGap>("SkillGap", skillGapSchema);
export default SkillGap;
