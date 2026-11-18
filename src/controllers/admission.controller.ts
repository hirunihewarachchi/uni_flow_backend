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
            qualification,
        } = req.body;

        const courseCode = req.body.courseCode || req.body.programInterest || req.body.course;
        const preferredIntake = req.body.preferredIntake || req.body.intake;
        const statement = req.body.statement || req.body.message;

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
            courseCode: String(courseCode).toUpperCase(),
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

        const normalizedStatus = status ? (String(status).toUpperCase() as AdmissionStatus) : null;

        if (!normalizedStatus || !Object.values(AdmissionStatus).includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (PENDING, CONTACTED, FOLLOW_UP, APPROVED, REJECTED, REGISTERED)"
            });
        }

        const updated = await updateAdmissionRequestStatus(
            id as string,
            normalizedStatus,
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
            message: `Admission request status updated to ${normalizedStatus}`,
            data: updated
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update status"
        });
    }
};
