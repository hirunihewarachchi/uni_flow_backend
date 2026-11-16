import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export const getOverview = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getAdminOverview();
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await adminService.getStaffList();
        res.status(200).json({ status: "success", data: staff });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const createStaff = async (req: Request, res: Response) => {
    try {
        const staff = await adminService.createStaff(req.body);
        res.status(201).json({ status: "success", data: staff });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const toggleStaffStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminService.toggleStaffStatus(id as string);
        res.status(200).json({ status: "success", data: result });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const resetStaffPassword = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const result = await adminService.resetStaffPassword(id as string, password);
        res.status(200).json({ status: "success", data: result });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminService.deleteStaff(id as string);
        res.status(200).json({ status: "success", data: result });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getWebsite = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getWebsiteContent();
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateWebsite = async (req: Request, res: Response) => {
    try {
        const data = await adminService.updateWebsiteContent(req.body);
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getAllAnnouncements();
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const data = await adminService.createAnnouncement(req.body);
        res.status(201).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await adminService.updateAnnouncement(id as string, req.body);
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await adminService.deleteAnnouncement(id as string);
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getAdminCourses();
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const data = await adminService.createAdminCourse(req.body);
        res.status(201).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await adminService.updateAdminCourse(id as string, req.body);
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await adminService.deleteAdminCourse(id as string);
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getActivity = async (req: Request, res: Response) => {
    try {
        const data = await adminService.getActivityLogs();
        res.status(200).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
