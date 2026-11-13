
import mongoose, { Schema, Document } from "mongoose";

// Available user roles in UniFlow
export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    MARKETING_OFFICER = "MARKETING_OFFICER",
    FINANCE_OFFICER = "FINANCE_OFFICER",
    ACADEMIC_OFFICER = "ACADEMIC_OFFICER",
    EXAM_OFFICER = "EXAM_OFFICER",
    LECTURER = "LECTURER",
    STUDENT = "STUDENT"
}

// User document interface
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
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

        password: {
            type: String,
            required: true,
            minlength: 8
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
        }
    },
    {
        timestamps: true
    }
);

// Create User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
