import mongoose, { Schema, Document } from "mongoose";

export interface IExamination extends Document {
    batchNumber: string; // e.g. "HDSE 75"
    subject: string; // e.g. "Programming Fundamentals (PRF)"
    examType: string; // "Final Examination", "Practical Examination", "Mid Examination"
    date: string; // YYYY-MM-DD
    startTime: string; // "09:00 AM"
    endTime: string; // "12:00 PM"
    duration: string; // "3 Hours"
    venue: string; // "Lab 01", "Hall A"
    status: "Upcoming" | "Completed";
    isPublished: boolean;
}

const examinationSchema = new Schema<IExamination>(
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
        examType: {
            type: String,
            required: true,
            trim: true,
            default: "Final Examination"
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
        duration: {
            type: String,
            required: true,
            trim: true,
            default: "3 Hours"
        },
        venue: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Upcoming", "Completed"],
            default: "Upcoming"
        },
        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Examination = mongoose.model<IExamination>("Examination", examinationSchema);
export default Examination;
