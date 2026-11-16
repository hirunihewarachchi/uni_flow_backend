import mongoose, { Schema, Document } from "mongoose";

// Student registration status
export enum StudentStatus {
    PENDING_ACTIVATION = "PENDING_ACTIVATION",
    ACTIVATED = "ACTIVATED",
    SUSPENDED = "SUSPENDED"
}

// Student interface
export interface IStudent extends Document {
    registrationNumber: string; // backwards compatibility
    studentId?: string; // required format: HDSE75-12345
    institutionalId?: string; // required format: name,batch@ijse.com
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    courseCode?: string; // HDSE, CMJD, CAME, Foundation
    batchNumber?: string; // e.g. HDSE-75, GDSE 75
    userId?: mongoose.Types.ObjectId;
    admissionRequestId?: mongoose.Types.ObjectId;
    status: StudentStatus;
    registeredDate?: string;
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

        studentId: {
            type: String,
            sparse: true,
            unique: true,
            trim: true
        },

        institutionalId: {
            type: String,
            sparse: true,
            unique: true,
            trim: true,
            lowercase: true
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

        courseCode: {
            type: String,
            trim: true
        },

        batchNumber: {
            type: String,
            trim: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        admissionRequestId: {
            type: Schema.Types.ObjectId,
            ref: "AdmissionRequest"
        },

        status: {
            type: String,
            enum: Object.values(StudentStatus),
            default: StudentStatus.PENDING_ACTIVATION
        },

        registeredDate: {
            type: String,
            default: () => new Date().toISOString().slice(0, 10)
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