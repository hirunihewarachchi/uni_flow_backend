import mongoose, { Schema, Document } from "mongoose";

export enum AdmissionStatus {
    PENDING = "PENDING",
    CONTACTED = "CONTACTED",
    FOLLOW_UP = "FOLLOW_UP",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REGISTERED = "REGISTERED"
}

export interface IAdmissionRequest extends Document {
    referenceNo: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    address?: string;
    courseCode: string;
    preferredIntake?: string;
    qualification?: string;
    statement?: string;
    status: AdmissionStatus;
    notes?: string;
    reviewedBy?: mongoose.Types.ObjectId;
}

const admissionRequestSchema = new Schema<IAdmissionRequest>(
    {
        referenceNo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        fullName: {
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
        dateOfBirth: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        courseCode: {
            type: String,
            required: true,
            trim: true
        },
        preferredIntake: {
            type: String,
            trim: true
        },
        qualification: {
            type: String,
            trim: true
        },
        statement: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(AdmissionStatus),
            default: AdmissionStatus.PENDING
        },
        notes: {
            type: String,
            trim: true
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const AdmissionRequest = mongoose.model<IAdmissionRequest>("AdmissionRequest", admissionRequestSchema);
export default AdmissionRequest;
