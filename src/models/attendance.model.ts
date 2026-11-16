import mongoose, { Schema, Document } from "mongoose";

export enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE"
}

export interface IAttendance extends Document {
    lectureScheduleId: mongoose.Types.ObjectId;
    batchNumber: string;
    studentId: string; // e.g. "IJSE-001" or "HDSE75-12345"
    studentName: string;
    status: AttendanceStatus;
    markedBy?: mongoose.Types.ObjectId;
    date: string;
}

const attendanceSchema = new Schema<IAttendance>(
    {
        lectureScheduleId: {
            type: Schema.Types.ObjectId,
            ref: "LectureSchedule",
            required: true
        },
        batchNumber: {
            type: String,
            required: true,
            trim: true
        },
        studentId: {
            type: String,
            required: true,
            trim: true
        },
        studentName: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(AttendanceStatus),
            default: AttendanceStatus.PRESENT
        },
        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate attendance for same student and lecture session
attendanceSchema.index({ lectureScheduleId: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
