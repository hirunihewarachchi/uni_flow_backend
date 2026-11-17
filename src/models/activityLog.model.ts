
import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
    userId?: mongoose.Types.ObjectId;
    userEmail?: string;
    role?: string;
    action: string;
    details?: string;
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
            type: String
        },
        action: {
            type: String,
            required: true
        },
        details: {
            type: String,
            default: ""
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ActivityLog = mongoose.model<IActivityLog>(
    "ActivityLog",
    activityLogSchema
);

export default ActivityLog;
