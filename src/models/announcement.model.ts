import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
    title: string;
    description: string;
    date: string;
    status: "PUBLISHED" | "DRAFT";
    targetAudience: "ALL" | "STUDENTS" | "STAFF";
}

const announcementSchema = new Schema<IAnnouncement>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: String,
            required: true,
            default: () => new Date().toISOString().slice(0, 10)
        },
        status: {
            type: String,
            enum: ["PUBLISHED", "DRAFT"],
            default: "PUBLISHED"
        },
        targetAudience: {
            type: String,
            enum: ["ALL", "STUDENTS", "STAFF"],
            default: "ALL"
        }
    },
    {
        timestamps: true
    }
);

const Announcement = mongoose.model<IAnnouncement>("Announcement", announcementSchema);
export default Announcement;
