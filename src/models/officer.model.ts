import mongoose, { Schema, Document } from "mongoose";

export interface IOfficer extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    department: "MARKETING" | "ACADEMIC" | "FINANCE" | "EXAM";
    position: string;
    status: "ACTIVE" | "INACTIVE";
}

const officerSchema = new Schema<IOfficer>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
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
        department: {
            type: String,
            required: true,
            enum: ["MARKETING", "ACADEMIC", "FINANCE", "EXAM"]
        },
        position: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

const Officer = mongoose.model<IOfficer>("Officer", officerSchema);
export default Officer;
