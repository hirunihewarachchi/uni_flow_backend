import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    code: string; // HDSE, CMJD, CAME, Foundation
    title: string;
    duration: string;
    structure: string;
    description: string;
    icon?: string;
    isPublished: boolean;
    fee: number;
}

const courseSchema = new Schema<ICourse>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        duration: {
            type: String,
            required: true,
            trim: true
        },
        structure: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        icon: {
            type: String,
            trim: true
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        fee: {
            type: Number,
            required: true,
            default: 250000
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
