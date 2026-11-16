import mongoose, { Schema, Document } from "mongoose";

export interface ILectureSchedule extends Document {
    batchNumber: string; // e.g. "GDSE 75", "HDSE-75"
    subject: string; // Module name/code
    lecturer: string; // Lecturer name
    lecturerId?: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    room: string; // Venue / Hall / Lab
    sessionInfo?: string;
}

const lectureScheduleSchema = new Schema<ILectureSchedule>(
    {
        batchNumber: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        lecturer: {
            type: String,
            required: true,
            trim: true
        },
        lecturerId: {
            type: Schema.Types.ObjectId,
            ref: "Lecturer"
        },
        date: {
            type: String,
            required: true,
            trim: true
        },
        startTime: {
            type: String,
            required: true,
            trim: true
        },
        endTime: {
            type: String,
            required: true,
            trim: true
        },
        room: {
            type: String,
            required: true,
            trim: true
        },
        sessionInfo: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const LectureSchedule = mongoose.model<ILectureSchedule>("LectureSchedule", lectureScheduleSchema);
export default LectureSchedule;
