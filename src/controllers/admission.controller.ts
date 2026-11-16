import { Request, Response } from "express";
import {
    createAdmissionRequest,
    getAllAdmissionRequests,
    getAdmissionRequestById,
    updateAdmissionRequestStatus
} from "../services/admission.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { AdmissionStatus } from "../models/admissionRequest.model";

// Public enrollment submission
export const submitAdmission = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            email,
            phone,
            dateOfBirth,
            address,
            courseCode,
            preferredIntake,
            qualification,
            statement
        } = req.body;

        if (!fullName || !email || !phone || !courseCode) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields (full name, email, phone, course)"
            });
        }

        const request = await createAdmissionRequest({
            fullName,
            email,
            phone,
            dateOfBirth,
            address,
            courseCode,
            preferredIntake,
            qualification,
            statement
        });

        return res.status(201).json({
            success: true,
            message: "Enrollment application submitted successfully",
            data: request
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to submit admission application"
        });
    }
};

// Marketing / Admin: Get all admission requests
export const listAdmissions = async (req: Request, res: Response) => {
    try {
        const { status, courseCode, search } = req.query;

        const requests = await getAllAdmissionRequests({
            status: status as string,
            courseCode: courseCode as string,
            search: search as string
        });

        return res.status(200).json({
            success: true,
            message: "Admission requests retrieved successfully",
            data: requests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve admission requests"
        });
    }
};

// Marketing / Admin: Update status
export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!status || !Object.values(AdmissionStatus).includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required"
            });
        }

        const updated = await updateAdmissionRequestStatus(
            id as string,
            status,
            notes,
            req.user?.userId
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Admission request not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Admission request status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update status"
        });
    }
};
