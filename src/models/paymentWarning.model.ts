import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentWarning extends Document {
    studentId: string;
    studentName: string;
    email: string;
    amountDue: number;
    dueDate: string;
    message: string;
    sentDate: string;
    status: "SENT" | "ACKNOWLEDGED" | "RESOLVED";
}

const paymentWarningSchema = new Schema<IPaymentWarning>(
    {
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
        email: {
            type: String,
            required: true,
            trim: true
        },
        amountDue: {
            type: Number,
            required: true
        },
        dueDate: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        sentDate: {
            type: String,
            default: () => new Date().toISOString().slice(0, 10)
        },
        status: {
            type: String,
            enum: ["SENT", "ACKNOWLEDGED", "RESOLVED"],
            default: "SENT"
        }
    },
    {
        timestamps: true
    }
);

const PaymentWarning = mongoose.model<IPaymentWarning>("PaymentWarning", paymentWarningSchema);
export default PaymentWarning;
