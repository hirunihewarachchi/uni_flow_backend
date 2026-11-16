import mongoose, { Schema, Document } from "mongoose";

export interface ILecturer extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    qualifications?: string;
    position?: string;
    departmentKey?: string; // default 'academic'
    assignedModules: string[]; // module codes or names
    isPublic: boolean;
    status: "ACTIVE" | "INACTIVE";
}

const lecturerSchema = new Schema<ILecturer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        qualifications: {
            type: String,
            trim: true
        },
        position: {
            type: String,
            default: "Academic Lecturer",
            trim: true
        },
        departmentKey: {
            type: String,
            default: "academic",
            trim: true
        },
        assignedModules: {
            type: [String],
            default: []
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

const Lecturer = mongoose.model<ILecturer>("Lecturer", lecturerSchema);
export default Lecturer;
