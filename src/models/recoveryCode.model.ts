import mongoose, { Schema, Document } from "mongoose";

export interface IRecoveryCode extends Document {
    userId: mongoose.Types.ObjectId;
    identifier: string;
    realEmail: string;
    code: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const recoveryCodeSchema = new Schema<IRecoveryCode>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        identifier: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        realEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        code: {
            type: String,
            required: true,
            trim: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // Document expires when expiresAt date is reached
        },
        used: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const RecoveryCode = mongoose.model<IRecoveryCode>("RecoveryCode", recoveryCodeSchema);
export default RecoveryCode;
