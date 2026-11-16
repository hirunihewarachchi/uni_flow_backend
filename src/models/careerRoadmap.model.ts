import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapPhase {
    phase: string;
    duration: string;
    topics: string[];
    task: string;
}

export interface ICareerOption {
    id: string;
    title: string;
    category: string;
    description: string;
    skills: string[];
    matchScore: number;
    roadmap: IRoadmapPhase[];
}

export interface ICareerRoadmap extends Document {
    studentId: string;
    studentName: string;
    batchNumber: string;
    selectedCareerId: string;
    selectedCareerTitle: string;
    careerConfirmed: boolean;
    recommendedCareers: ICareerOption[];
    studentPreferences?: string[];
    generatedByAI: boolean;
    updatedAt: Date;
}

const careerRoadmapSchema = new Schema<ICareerRoadmap>(
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
        selectedCareerId: {
            type: String,
            default: "business-analyst"
        },
        selectedCareerTitle: {
            type: String,
            default: "Business Analyst"
        },
        careerConfirmed: {
            type: Boolean,
            default: false
        },
        recommendedCareers: [
            {
                id: String,
                title: String,
                category: String,
                description: String,
                skills: [String],
                matchScore: Number,
                roadmap: [
                    {
                        phase: String,
                        duration: String,
                        topics: [String],
                        task: String
                    }
                ]
            }
        ],
        studentPreferences: {
            type: [String],
            default: []
        },
        generatedByAI: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const CareerRoadmap = mongoose.model<ICareerRoadmap>("CareerRoadmap", careerRoadmapSchema);
export default CareerRoadmap;
