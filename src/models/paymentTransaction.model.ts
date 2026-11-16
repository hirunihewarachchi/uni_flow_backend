import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentTransaction extends Document {
    studentId: string;
    studentName: string;
    batchNumber: string;
    amount: number;
    method: "Bank Transfer" | "Card" | "Cash" | "Online Gateway";
    reference: string;
    date: string;
    status: "SUCCESS" | "PENDING" | "FAILED" | "CANCELLED";
    gatewaySessionId?: string;
    verifiedBy?: mongoose.Types.ObjectId;
    receiptNo?: string;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>(
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
        batchNumber: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        method: {
            type: String,
            enum: ["Bank Transfer", "Card", "Cash", "Online Gateway"],
            required: true
        },
        reference: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        date: {
            type: String,
            required: true,
            default: () => new Date().toISOString().slice(0, 10)
        },
        status: {
            type: String,
            enum: ["SUCCESS", "PENDING", "FAILED", "CANCELLED"],
            default: "SUCCESS"
        },
        gatewaySessionId: {
            type: String,
            trim: true
        },
        verifiedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        receiptNo: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const PaymentTransaction = mongoose.model<IPaymentTransaction>("PaymentTransaction", paymentTransactionSchema);
export default PaymentTransaction;
