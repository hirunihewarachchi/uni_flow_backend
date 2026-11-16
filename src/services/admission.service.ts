import AdmissionRequest, { AdmissionStatus, IAdmissionRequest } from "../models/admissionRequest.model";

/**
 * Generate a unique application reference e.g. ENQ-001, ENQ-002
 */
const generateReferenceNo = async (): Promise<string> => {
    const count = await AdmissionRequest.countDocuments();
    let num = count + 1;
    let ref = `ENQ-${String(num).padStart(3, "0")}`;

    let exists = await AdmissionRequest.findOne({ referenceNo: ref });
    while (exists) {
        num += 1;
        ref = `ENQ-${String(num).padStart(3, "0")}`;
        exists = await AdmissionRequest.findOne({ referenceNo: ref });
    }

    return ref;
};

export const createAdmissionRequest = async (data: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    address?: string;
    courseCode: string;
    preferredIntake?: string;
    qualification?: string;
    statement?: string;
}): Promise<IAdmissionRequest> => {
    const referenceNo = await generateReferenceNo();

    const request = await AdmissionRequest.create({
        ...data,
        email: data.email.toLowerCase(),
        referenceNo,
        status: AdmissionStatus.PENDING
    });

    return request;
};

export const getAllAdmissionRequests = async (filters?: {
    status?: string;
    courseCode?: string;
    search?: string;
}) => {
    const query: any = {};

    if (filters?.status && filters.status !== "ALL" && filters.status !== "All") {
        query.status = filters.status.toUpperCase();
    }

    if (filters?.courseCode && filters.courseCode !== "ALL" && filters.courseCode !== "All") {
        query.courseCode = filters.courseCode;
    }

    if (filters?.search) {
        const regex = new RegExp(filters.search, "i");
        query.$or = [{ fullName: regex }, { email: regex }, { referenceNo: regex }, { phone: regex }];
    }

    return await AdmissionRequest.find(query).sort({ createdAt: -1 });
};

export const getAdmissionRequestById = async (id: string) => {
    return await AdmissionRequest.findById(id);
};

export const updateAdmissionRequestStatus = async (
    id: string,
    status: AdmissionStatus,
    notes?: string,
    reviewedBy?: string
) => {
    return await AdmissionRequest.findByIdAndUpdate(
        id,
        {
            status,
            ...(notes ? { notes } : {}),
            ...(reviewedBy ? { reviewedBy } : {})
        },
        { new: true }
    );
};
