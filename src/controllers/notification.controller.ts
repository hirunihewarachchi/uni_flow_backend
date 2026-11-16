import { Request, Response } from "express";
import Notification from "../models/notification.model";

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const query: any = {
            $or: [
                { recipientRole: "ALL" },
                { recipientId: user._id }
            ]
        };

        if (user.role) {
            query.$or.push({ recipientRole: user.role });
        }

        if (user.studentId) {
            query.$or.push({ studentId: user.studentId });
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(30);

        const unreadCount = await Notification.countDocuments({
            ...query,
            isRead: false
        });

        res.status(200).json({
            status: "success",
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notif = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        res.status(200).json({ status: "success", data: notif });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const query: any = {
            $or: [
                { recipientRole: "ALL" },
                { recipientId: user._id }
            ]
        };

        if (user.role) query.$or.push({ recipientRole: user.role });
        if (user.studentId) query.$or.push({ studentId: user.studentId });

        await Notification.updateMany(query, { isRead: true });

        res.status(200).json({ status: "success", message: "All notifications marked as read" });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
