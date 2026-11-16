import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    recipientId?: mongoose.Types.ObjectId;
    recipientRole?: string; // "ALL", "STUDENT", "MARKETING", "ACADEMIC", "FINANCE", "EXAM", "ADMIN"
    studentId?: string;
    title: string;
    message: string;
    category:
        | "ADMISSION"
        | "REGISTRATION"
        | "TIMETABLE"
        | "EXAMINATION"
        | "RESULT"
        | "PAYMENT_REMINDER"
        | "PAYMENT_WARNING"
        | "PAYMENT_CONFIRMATION"
        | "ANNOUNCEMENT";
    isRead: boolean;
    link?: string;
}

const notificationSchema = new Schema<INotification>(
    {
        recipientId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        recipientRole: {
            type: String,
            default: "ALL"
        },
        studentId: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        link: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
