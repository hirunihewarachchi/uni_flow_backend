import mongoose, { Schema, Document } from "mongoose";

export enum BatchStatus {
    ACTIVE = "ACTIVE",
    UPCOMING = "UPCOMING",
    COMPLETED = "COMPLETED"
}

export interface IBatch extends Document {
    batchNumber: string; // e.g. "HDSE-75", "GDSE 75", "CMJD-01"
    courseCode: string; // "HDSE", "CMJD", "CAME", "Foundation"
    courseName?: string;
    startDate: string;
    endDate: string;
    status: BatchStatus;
}

const batchSchema = new Schema<IBatch>(
    {
        batchNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        courseCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        courseName: {
            type: String,
            trim: true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(BatchStatus),
            default: BatchStatus.ACTIVE
        }
    },
    {
        timestamps: true
    }
);

const Batch = mongoose.model<IBatch>("Batch", batchSchema);
export default Batch;
