import { Request, Response } from "express";
import * as publicService from "../services/public.service";

export const getPublicDashboard = async (req: Request, res: Response) => {
    try {
        const data = await publicService.getPublicDashboardData();
        res.status(200).json({
            status: "success",
            data
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "Failed to fetch public dashboard data"
        });
    }
};

export const getPublicDepartments = async (req: Request, res: Response) => {
    try {
        const data = await publicService.getPublicDepartmentsData();
        res.status(200).json({
            status: "success",
            data
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "Failed to fetch public departments"
        });
    }
};

export const getPublicCourses = async (req: Request, res: Response) => {
    try {
        const data = await publicService.getPublicCoursesData();
        res.status(200).json({
            status: "success",
            data
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "Failed to fetch public courses"
        });
    }
};
