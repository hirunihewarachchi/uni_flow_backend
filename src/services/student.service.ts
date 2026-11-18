import bcrypt from "bcryptjs";
import Student, { IStudent, StudentStatus } from "../models/student.model";
import User, { UserRole } from "../models/user.model";
import PaymentSchedule from "../models/paymentSchedule.model";
import AdmissionRequest, { AdmissionStatus } from "../models/admissionRequest.model";
import Course from "../models/course.model";
import { generateStudentId, generateInstitutionalEmail } from "../utils/idGenerator";

// Student registration data (Existing interface)
export interface StudentRegistrationData {
    registrationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    courseCode?: string;
    batchNumber?: string;
}

// Marketing registration data (With auto-generated IDs and credentials)
export interface MarketingRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    course: string; // e.g. "HDSE"
    batch: string; // e.g. "HDSE-75"
    address?: string;
    admissionRequestId?: string;
    password?: string;
}

// Register a new student (Existing function preserved)
export const registerStudent = async (
    studentData: StudentRegistrationData
) => {
    // Check whether registration number already exists
    const existingRegistration = await Student.findOne({
        registrationNumber: studentData.registrationNumber
    });

    if (existingRegistration) {
        throw new Error("Registration number already exists");
    }

    // Check whether email already exists
    const existingEmail = await Student.findOne({
        email: studentData.email
    });

    if (existingEmail) {
        throw new Error("Student email already exists");
    }

    // Create student record
    const student = await Student.create({
        ...studentData,
        studentId: studentData.registrationNumber,
        email: studentData.email.toLowerCase()
    });

    return student;
};

// Full Institute Student Registration by Marketing Department
export const registerStudentByMarketing = async (data: MarketingRegistrationData) => {
    const { firstName, lastName, email, phone, course, batch, address, admissionRequestId } = data;

    // 1. Generate unique student ID (e.g. HDSE75-12345)
    const generatedId = await generateStudentId(course, batch);

    // 2. Generate unique institutional login identifier (e.g. hiruni,hdse75@ijse.com)
    const institutionalIdentifier = await generateInstitutionalEmail(firstName, batch);

    // 3. Initial password is provided password or the generated student ID
    const initialPassword = (data.password && data.password.trim()) || generatedId;
    const hashedPassword = await bcrypt.hash(initialPassword, 12);

    // 4. Create Student User Account
    const user = await User.create({
        firstName,
        lastName,
        email: institutionalIdentifier,
        institutionalId: institutionalIdentifier,
        password: hashedPassword,
        phone,
        role: UserRole.STUDENT,
        isActive: true,
        mustChangePassword: true,
        studentId: generatedId,
        batchNumber: batch
    });

    // 5. Create Student Record
    const student = await Student.create({
        registrationNumber: generatedId,
        studentId: generatedId,
        institutionalId: institutionalIdentifier,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        address,
        courseCode: course,
        batchNumber: batch,
        userId: user._id,
        admissionRequestId: admissionRequestId ? admissionRequestId : undefined,
        status: StudentStatus.ACTIVATED,
        registeredDate: new Date().toISOString().slice(0, 10)
    });

    // 6. Look up course fee and initialize payment schedule
    const courseDoc = await Course.findOne({ code: course.toUpperCase() });
    const fee = courseDoc ? courseDoc.fee : 250000;

    await PaymentSchedule.create({
        studentId: generatedId,
        studentName: `${firstName} ${lastName}`,
        batchNumber: batch,
        courseCode: course,
        courseName: courseDoc ? courseDoc.title : course,
        planType: "semester",
        totalFee: fee,
        paidAmount: 0,
        status: "UNPAID",
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        nextDueAmount: Math.round(fee / 4)
    });

    // 7. If linked to an Admission Request, update its status to REGISTERED
    if (admissionRequestId) {
        await AdmissionRequest.findByIdAndUpdate(admissionRequestId, {
            status: AdmissionStatus.REGISTERED
        });
    }

    return {
        student,
        user: {
            id: user._id,
            email: user.email,
            institutionalId: user.institutionalId,
            studentId: user.studentId
        },
        credentials: {
            studentId: generatedId,
            institutionalEmail: institutionalIdentifier,
            initialPassword: initialPassword
        }
    };
};

// Get all registered students with search & batch filtering
export const getAllStudents = async (filter?: {
    courseCode?: string;
    batchNumber?: string;
    search?: string;
}) => {
    const query: any = {};

    if (filter?.courseCode && filter.courseCode !== "All" && filter.courseCode !== "ALL") {
        query.courseCode = filter.courseCode;
    }

    if (filter?.batchNumber && filter.batchNumber !== "All" && filter.batchNumber !== "ALL") {
        query.batchNumber = filter.batchNumber;
    }

    if (filter?.search) {
        const regex = new RegExp(filter.search, "i");
        query.$or = [
            { firstName: regex },
            { lastName: regex },
            { studentId: regex },
            { registrationNumber: regex },
            { email: regex },
            { institutionalId: regex }
        ];
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    return students;
};

// Get student by ID
export const getStudentById = async (studentId: string) => {
    // Search by Mongo _id, or by studentId / registrationNumber
    if (/^[0-9a-fA-F]{24}$/.test(studentId)) {
        const student = await Student.findById(studentId);
        if (student) return student;
    }

    return await Student.findOne({
        $or: [{ studentId: studentId }, { registrationNumber: studentId }]
    });
};

// Update student details
export const updateStudent = async (
    studentId: string,
    studentData: {
        registrationNumber?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        courseCode?: string;
        batchNumber?: string;
        status?: StudentStatus;
    }
) => {
    const query = /^[0-9a-fA-F]{24}$/.test(studentId)
        ? { _id: studentId }
        : { $or: [{ studentId: studentId }, { registrationNumber: studentId }] };

    const updateFields: any = { ...studentData };
    if (studentData.email) {
        updateFields.email = studentData.email.toLowerCase();
    }

    const student = await Student.findOneAndUpdate(
        query,
        updateFields,
        {
            new: true,
            runValidators: true
        }
    );

    return student;
};

// Delete student by ID
export const deleteStudent = async (studentId: string) => {
    const query = /^[0-9a-fA-F]{24}$/.test(studentId)
        ? { _id: studentId }
        : { $or: [{ studentId: studentId }, { registrationNumber: studentId }] };

    const student = await Student.findOneAndDelete(query);
    return student;
};
