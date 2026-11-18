import mongoose, { Schema, Document } from "mongoose";

// Available user roles in IJSE
export enum UserRole {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    MARKETING = "MARKETING",
    MARKETING_OFFICER = "MARKETING_OFFICER",
    ACADEMIC = "ACADEMIC",
    ACADEMIC_OFFICER = "ACADEMIC_OFFICER",
    EXAM = "EXAM",
    EXAM_OFFICER = "EXAM_OFFICER",
    FINANCE = "FINANCE",
    FINANCE_OFFICER = "FINANCE_OFFICER",
    LECTURER = "LECTURER",
    STUDENT = "STUDENT"
}

// User document interface
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string; // personal email or institutional login identifier
    institutionalId?: string; // studentName,batchNo@ijse.com
    password: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    mustChangePassword?: boolean;
    studentId?: string; // e.g. HDSE75-12345
    department?: string;
    batchNumber?: string;
}

// User schema
const userSchema = new Schema<IUser>(
    {
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

        institutionalId: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        phone: {
            type: String,
            trim: true
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.STUDENT
        },

        isActive: {
            type: Boolean,
            default: true
        },

        mustChangePassword: {
            type: Boolean,
            default: false
        },

        studentId: {
            type: String,
            trim: true
        },

        department: {
            type: String,
            trim: true
        },

        batchNumber: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Create User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
