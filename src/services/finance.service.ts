import PaymentSchedule, { IPaymentSchedule } from "../models/paymentSchedule.model";
import PaymentTransaction, { IPaymentTransaction } from "../models/paymentTransaction.model";
import PaymentReceipt, { IPaymentReceipt } from "../models/paymentReceipt.model";
import PaymentWarning from "../models/paymentWarning.model";
import Student from "../models/student.model";
import Notification from "../models/notification.model";
import crypto from "crypto";

// Unique receipt number generator: RCT-1001, RCT-1002...
const generateReceiptNo = async (): Promise<string> => {
    const count = await PaymentReceipt.countDocuments();
    let num = 1001 + count;
    let receiptNo = `RCT-${num}`;

    let exists = await PaymentReceipt.findOne({ receiptNo });
    while (exists) {
        num += 1;
        receiptNo = `RCT-${num}`;
        exists = await PaymentReceipt.findOne({ receiptNo });
    }

    return receiptNo;
};

// Unique transaction reference generator: TRX-1001...
const generateTransactionRef = async (): Promise<string> => {
    const count = await PaymentTransaction.countDocuments();
    let num = 1001 + count;
    let ref = `TRX-${num}`;

    let exists = await PaymentTransaction.findOne({ reference: ref });
    while (exists) {
        num += 1;
        ref = `TRX-${num}`;
        exists = await PaymentTransaction.findOne({ reference: ref });
    }

    return ref;
};

// Overview summary (Total expected, collected, outstanding, batch-wise summary)
export const getFinanceOverview = async () => {
    const schedules = await PaymentSchedule.find();

    const totalRevenue = schedules.reduce((sum, s) => sum + s.totalFee, 0);
    const totalCollected = schedules.reduce((sum, s) => sum + s.paidAmount, 0);
    const totalOutstanding = Math.max(totalRevenue - totalCollected, 0);

    const batches = [...new Set(schedules.map(s => s.batchNumber))];
    const batchSummary = batches.map(batch => {
        const batchSchedules = schedules.filter(s => s.batchNumber === batch);
        const expected = batchSchedules.reduce((sum, s) => sum + s.totalFee, 0);
        const collected = batchSchedules.reduce((sum, s) => sum + s.paidAmount, 0);
        return {
            batch,
            studentCount: batchSchedules.length,
            expected,
            collected,
            outstanding: Math.max(expected - collected, 0)
        };
    });

    return {
        totalRevenue,
        totalCollected,
        totalOutstanding,
        registeredStudents: schedules.length,
        batchSummary
    };
};

// Get student payment records with optional batch or search filter
export const getStudentPayments = async (filters?: {
    batchNumber?: string;
    status?: string;
    search?: string;
}) => {
    const query: any = {};
    if (filters?.batchNumber && filters.batchNumber !== "ALL" && filters.batchNumber !== "All") {
        query.batchNumber = filters.batchNumber;
    }
    if (filters?.status && filters.status !== "ALL" && filters.status !== "All") {
        query.status = filters.status;
    }
    if (filters?.search) {
        const regex = new RegExp(filters.search, "i");
        query.$or = [{ studentName: regex }, { studentId: regex }];
    }

    const schedules = await PaymentSchedule.find(query).sort({ createdAt: -1 });

    return schedules.map(s => ({
        id: s._id,
        studentId: s.studentId,
        name: s.studentName,
        batch: s.batchNumber,
        course: s.courseName || s.courseCode,
        totalFee: s.totalFee,
        paid: s.paidAmount,
        balance: Math.max(s.totalFee - s.paidAmount, 0),
        status: s.status
    }));
};

// Record payment (manual bank transfer, cash, etc.)
export const recordPayment = async (data: {
    studentId: string;
    amount: number;
    method: "Bank Transfer" | "Card" | "Cash" | "Online Gateway";
    reference?: string;
    date?: string;
    verifiedBy?: string;
}) => {
    const schedule = await PaymentSchedule.findOne({ studentId: data.studentId });
    if (!schedule) {
        throw new Error("Student payment schedule not found");
    }

    const outstanding = schedule.totalFee - schedule.paidAmount;
    if (data.amount > outstanding) {
        throw new Error(`Payment cannot exceed outstanding balance of LKR ${outstanding}`);
    }

    const ref = data.reference || await generateTransactionRef();
    const date = data.date || new Date().toISOString().slice(0, 10);

    // 1. Create transaction record
    const transaction = await PaymentTransaction.create({
        studentId: schedule.studentId,
        studentName: schedule.studentName,
        batchNumber: schedule.batchNumber,
        amount: data.amount,
        method: data.method,
        reference: ref,
        date,
        status: "SUCCESS",
        verifiedBy: data.verifiedBy
    });

    // 2. Generate Receipt
    const receiptNo = await generateReceiptNo();
    const receipt = await PaymentReceipt.create({
        receiptNo,
        transactionReference: ref,
        studentId: schedule.studentId,
        studentName: schedule.studentName,
        amount: data.amount,
        paymentMethod: data.method,
        paymentDate: date,
        issuedBy: "Finance Department"
    });

    transaction.receiptNo = receiptNo;
    await transaction.save();

    // 3. Update payment schedule
    schedule.paidAmount += data.amount;
    schedule.status = schedule.paidAmount >= schedule.totalFee ? "PAID" : "PARTIAL";
    await schedule.save();

    // 4. Issue Notification to student
    await Notification.create({
        studentId: schedule.studentId,
        title: "Payment Received",
        message: `Your payment of LKR ${data.amount.toLocaleString()} was successfully recorded. Receipt: ${receiptNo}`,
        category: "PAYMENT_CONFIRMATION"
    });

    return { transaction, receipt, schedule };
};

// Online Card Payment Gateway: Create Checkout Session
export const createOnlinePaymentSession = async (data: {
    studentId: string;
    amount: number;
    planType: string;
}) => {
    const schedule = await PaymentSchedule.findOne({ studentId: data.studentId });
    if (!schedule) {
        throw new Error("Student payment schedule not found");
    }

    const sessionId = `SESSION-${crypto.randomBytes(8).toString("hex")}`;
    const transactionRef = await generateTransactionRef();

    // Create pending transaction record
    await PaymentTransaction.create({
        studentId: schedule.studentId,
        studentName: schedule.studentName,
        batchNumber: schedule.batchNumber,
        amount: data.amount,
        method: "Online Gateway",
        reference: transactionRef,
        date: new Date().toISOString().slice(0, 10),
        status: "PENDING",
        gatewaySessionId: sessionId
    });

    return {
        sessionId,
        transactionRef,
        amount: data.amount,
        currency: "LKR",
        studentName: schedule.studentName,
        studentId: schedule.studentId
    };
};

// Online Card Payment Gateway: Verify Payment
export const verifyOnlinePayment = async (sessionId: string, status: "SUCCESS" | "FAILED") => {
    const transaction = await PaymentTransaction.findOne({ gatewaySessionId: sessionId });
    if (!transaction) {
        throw new Error("Transaction session not found");
    }

    if (transaction.status === "SUCCESS") {
        return { success: true, message: "Transaction already verified", transaction };
    }

    if (status === "SUCCESS") {
        transaction.status = "SUCCESS";
        const receiptNo = await generateReceiptNo();
        const receipt = await PaymentReceipt.create({
            receiptNo,
            transactionReference: transaction.reference,
            studentId: transaction.studentId,
            studentName: transaction.studentName,
            amount: transaction.amount,
            paymentMethod: "Card (Online Gateway)",
            paymentDate: new Date().toISOString().slice(0, 10),
            issuedBy: "Online Payment Gateway"
        });

        transaction.receiptNo = receiptNo;
        await transaction.save();

        // Update schedule
        const schedule = await PaymentSchedule.findOne({ studentId: transaction.studentId });
        if (schedule) {
            schedule.paidAmount += transaction.amount;
            schedule.status = schedule.paidAmount >= schedule.totalFee ? "PAID" : "PARTIAL";
            await schedule.save();
        }

        return { success: true, transaction, receipt };
    } else {
        transaction.status = "FAILED";
        await transaction.save();
        return { success: false, message: "Payment was not successful", transaction };
    }
};

// Get transactions history
export const getTransactions = async (filters?: {
    batchNumber?: string;
    search?: string;
    studentId?: string;
}) => {
    const query: any = {};
    if (filters?.batchNumber && filters.batchNumber !== "ALL" && filters.batchNumber !== "All") {
        query.batchNumber = filters.batchNumber;
    }
    if (filters?.studentId) {
        query.studentId = filters.studentId;
    }
    if (filters?.search) {
        const regex = new RegExp(filters.search, "i");
        query.$or = [{ studentName: regex }, { reference: regex }, { studentId: regex }];
    }

    return await PaymentTransaction.find(query).sort({ createdAt: -1 });
};

// Send Payment Warning
export const sendPaymentWarning = async (data: {
    studentId: string;
    amountDue: number;
    dueDate: string;
    customMessage?: string;
}) => {
    const student = await Student.findOne({
        $or: [{ studentId: data.studentId }, { registrationNumber: data.studentId }]
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const message = data.customMessage ||
        `Important: An outstanding payment of LKR ${data.amountDue.toLocaleString()} is due by ${data.dueDate}. Please settle the balance before the deadline to ensure uninterrupted access to academic services.`;

    const warning = await PaymentWarning.create({
        studentId: student.studentId || student.registrationNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        amountDue: data.amountDue,
        dueDate: data.dueDate,
        message,
        status: "SENT"
    });

    // Also dispatch in-app notification
    await Notification.create({
        studentId: student.studentId || student.registrationNumber,
        title: "Payment Warning Notice",
        message,
        category: "PAYMENT_WARNING"
    });

    return warning;
};

// Get student's personal finance details for student portal
export const getMyFinance = async (studentId: string) => {
    const schedule = await PaymentSchedule.findOne({ studentId });
    const transactions = await PaymentTransaction.find({ studentId }).sort({ createdAt: -1 });
    const receipts = await PaymentReceipt.find({ studentId }).sort({ createdAt: -1 });
    const warnings = await PaymentWarning.find({ studentId }).sort({ createdAt: -1 });

    return {
        schedule,
        transactions,
        receipts,
        warnings
    };
};
