import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
    userId?: mongoose.Types.ObjectId;
    userEmail?: string;
    role?: string;
    action: string;
    details?: string;
    ipAddress?: string;
    timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        userEmail: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            trim: true
        },
        action: {
            type: String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            trim: true
        },
        ipAddress: {
            type: String,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);
export default ActivityLog;
