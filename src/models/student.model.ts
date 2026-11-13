
import mongoose, { Schema, Document } from "mongoose";

// Student registration status
export enum StudentStatus {
    PENDING_ACTIVATION = "PENDING_ACTIVATION",
    ACTIVATED = "ACTIVATED"
}

// Student interface
export interface IStudent extends Document {
    registrationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    status: StudentStatus;
}

// Student schema
const studentSchema = new Schema<IStudent>(
    {
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: Object.values(StudentStatus),
            default: StudentStatus.PENDING_ACTIVATION
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model<IStudent>(
    "Student",
    studentSchema
);

export default Student;