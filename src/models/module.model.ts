import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
    code: string;
    name: string;
    courseCode: string; // HDSE, CMJD, CAME, Foundation
    semester?: string; // "Semester 1", "Semester 2", "Semester 3", "Semester 4", or null
    description?: string;
    credits?: number;
}

const moduleSchema = new Schema<IModule>(
    {
        code: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        courseCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        semester: {
            type: String,
            trim: true,
            default: null
        },
        description: {
            type: String,
            trim: true
        },
        credits: {
            type: Number,
            default: 4
        }
    },
    {
        timestamps: true
    }
);

// Compound index on courseCode + code
moduleSchema.index({ courseCode: 1, code: 1 }, { unique: true });

const Module = mongoose.model<IModule>("Module", moduleSchema);
export default Module;
