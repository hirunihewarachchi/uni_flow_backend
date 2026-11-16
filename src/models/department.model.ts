import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
    key: string; // marketing, academic, exam, finance
    name: string;
    description: string;
    color?: string;
    isPublic: boolean;
}

const departmentSchema = new Schema<IDepartment>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        color: {
            type: String,
            default: "bg-red-50 text-[#D71920]"
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Department = mongoose.model<IDepartment>("Department", departmentSchema);
export default Department;
