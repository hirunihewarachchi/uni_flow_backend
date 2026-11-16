import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentSchedule extends Document {
    studentId: string;
    studentName: string;
    batchNumber: string;
    courseCode: string;
    courseName?: string;
    planType: "full" | "annual" | "semester";
    totalFee: number;
    paidAmount: number;
    status: "PAID" | "PARTIAL" | "UNPAID";
    nextDueDate?: string;
    nextDueAmount?: number;
}

const paymentScheduleSchema = new Schema<IPaymentSchedule>(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
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
        courseCode: {
            type: String,
            required: true,
            trim: true
        },
        courseName: {
            type: String,
            trim: true
        },
        planType: {
            type: String,
            enum: ["full", "annual", "semester"],
            default: "semester"
        },
        totalFee: {
            type: Number,
            required: true,
            default: 250000
        },
        paidAmount: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: String,
            enum: ["PAID", "PARTIAL", "UNPAID"],
            default: "UNPAID"
        },
        nextDueDate: {
            type: String
        },
        nextDueAmount: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

const PaymentSchedule = mongoose.model<IPaymentSchedule>("PaymentSchedule", paymentScheduleSchema);
export default PaymentSchedule;
