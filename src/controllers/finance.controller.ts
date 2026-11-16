import { Request, Response } from "express";
import {
    getFinanceOverview,
    getStudentPayments,
    recordPayment,
    createOnlinePaymentSession,
    verifyOnlinePayment,
    getTransactions,
    sendPaymentWarning,
    getMyFinance
} from "../services/finance.service";
import { AuthRequest } from "../middleware/auth.middleware";
import Student from "../models/student.model";
import User from "../models/user.model";

// Department Overview
export const handleGetFinanceOverview = async (req: Request, res: Response) => {
    try {
        const overview = await getFinanceOverview();
        return res.status(200).json({
            success: true,
            data: overview
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve finance overview"
        });
    }
};

// Student Payments Table
export const handleGetStudentPayments = async (req: Request, res: Response) => {
    try {
        const { batchNumber, status, search } = req.query;
        const payments = await getStudentPayments({
            batchNumber: batchNumber as string,
            status: status as string,
            search: search as string
        });
        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve student payments"
        });
    }
};

// Manual Payment Recording
export const handleRecordPayment = async (req: AuthRequest, res: Response) => {
    try {
        const result = await recordPayment({
            ...req.body,
            verifiedBy: req.user?.userId
        });
        return res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to record payment"
        });
    }
};

// Online Card Payment: Create Session
export const handleCreatePaymentSession = async (req: AuthRequest, res: Response) => {
    try {
        const result = await createOnlinePaymentSession(req.body);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to initiate payment session"
        });
    }
};

// Online Card Payment: Verify / Webhook
export const handleVerifyPayment = async (req: Request, res: Response) => {
    try {
        const { sessionId, status } = req.body;
        const result = await verifyOnlinePayment(sessionId, status || "SUCCESS");
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Payment verification failed"
        });
    }
};

// Transactions List
export const handleGetTransactions = async (req: Request, res: Response) => {
    try {
        const { batchNumber, search, studentId } = req.query;
        const list = await getTransactions({
            batchNumber: batchNumber as string,
            search: search as string,
            studentId: studentId as string
        });
        return res.status(200).json({
            success: true,
            data: list
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve transactions"
        });
    }
};

// Send Warning
export const handleSendWarning = async (req: Request, res: Response) => {
    try {
        const warning = await sendPaymentWarning(req.body);
        return res.status(200).json({
            success: true,
            message: "Payment warning notification dispatched",
            data: warning
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to send warning"
        });
    }
};

// Student Portal: My Finance details
export const handleGetMyFinance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const student = await Student.findOne({
            $or: [{ userId: user._id }, { studentId: user.studentId }, { email: user.email }, { institutionalId: user.email }]
        });

        const targetStudentId = student ? (student.studentId || student.registrationNumber) : user.studentId;

        if (!targetStudentId) {
            return res.status(200).json({ success: true, data: null });
        }

        const financeData = await getMyFinance(targetStudentId);
        return res.status(200).json({
            success: true,
            data: financeData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve student finance details"
        });
    }
};
