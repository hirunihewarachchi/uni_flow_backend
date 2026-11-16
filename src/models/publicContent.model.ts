import mongoose, { Schema, Document } from "mongoose";

export interface IPublicContent extends Document {
    key: string; // e.g. "website_info", "leadership"
    data: Record<string, any>;
    updatedBy?: mongoose.Types.ObjectId;
}

const publicContentSchema = new Schema<IPublicContent>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        data: {
            type: Schema.Types.Mixed,
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const PublicContent = mongoose.model<IPublicContent>("PublicContent", publicContentSchema);
export default PublicContent;
