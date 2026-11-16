import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentReceipt extends Document {
    receiptNo: string;
    transactionReference: string;
    studentId: string;
    studentName: string;
    amount: number;
    paymentMethod: string;
    paymentPurpose: string;
    paymentDate: string;
    issuedBy?: string;
}

const paymentReceiptSchema = new Schema<IPaymentReceipt>(
    {
        receiptNo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        transactionReference: {
            type: String,
            required: true,
            trim: true
        },
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
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentPurpose: {
            type: String,
            default: "Course Fee Installment"
        },
        paymentDate: {
            type: String,
            required: true
        },
        issuedBy: {
            type: String,
            default: "Finance Department"
        }
    },
    {
        timestamps: true
    }
);

const PaymentReceipt = mongoose.model<IPaymentReceipt>("PaymentReceipt", paymentReceiptSchema);
export default PaymentReceipt;
