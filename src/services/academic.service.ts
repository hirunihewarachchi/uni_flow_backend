import Batch, { BatchStatus, IBatch } from "../models/batch.model";
import Course, { ICourse } from "../models/course.model";
import Module, { IModule } from "../models/module.model";
import Lecturer, { ILecturer } from "../models/lecturer.model";
import LectureSchedule, { ILectureSchedule } from "../models/lectureSchedule.model";
import Attendance, { AttendanceStatus } from "../models/attendance.model";
import Student from "../models/student.model";
import User, { UserRole } from "../models/user.model";
import bcrypt from "bcryptjs";

// --- Batch Management ---
export const createBatch = async (data: {
    batchNumber: string;
    courseCode: string;
    courseName?: string;
    startDate: string;
    endDate: string;
    status?: BatchStatus;
}) => {
    const existing = await Batch.findOne({ batchNumber: data.batchNumber.trim() });
    if (existing) {
        throw new Error("Batch with this number already exists");
    }

    return await Batch.create(data);
};

export const getAllBatches = async () => {
    const batches = await Batch.find().sort({ createdAt: -1 });

    // Include student count for each batch
    const batchesWithCount = await Promise.all(
        batches.map(async (batch) => {
            const studentCount = await Student.countDocuments({
                $or: [{ batchNumber: batch.batchNumber }, { batchNumber: batch.batchNumber.replace("-", " ") }]
            });
            return {
                ...batch.toObject(),
                students: studentCount
            };
        })
    );

    return batchesWithCount;
};

export const getStudentsByBatch = async (batchNumber: string) => {
    const clean = (batchNumber || "").trim();
    if (!clean) return [];
    const regex = new RegExp(`^${clean.replace(/[- ]+/g, "[- ]?")}$`, "i");
    return await Student.find({
        $or: [
            { batchNumber: regex },
            { batchNumber: clean }
        ]
    }).sort({ firstName: 1 });
};

// --- Course & Module Management ---
export const getAllCourses = async () => {
    return await Course.find({ isPublished: true }).sort({ createdAt: 1 });
};

export const getModulesByCourse = async (courseCode: string) => {
    return await Module.find({ courseCode: courseCode.toUpperCase() }).sort({ semester: 1, code: 1 });
};

// --- Lecturer Management ---
export const getAllLecturers = async () => {
    return await Lecturer.find().sort({ name: 1 });
};

export const createLecturer = async (data: {
    name: string;
    email: string;
    phone: string;
    qualifications?: string;
    position?: string;
    assignedModules?: string[];
    isPublic?: boolean;
}) => {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const defaultPassword = "lecturer@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const user = await User.create({
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || "Lecturer",
        email: data.email.toLowerCase(),
        password: hashedPassword,
        phone: data.phone,
        role: UserRole.LECTURER,
        isActive: true,
        mustChangePassword: true
    });

    const lecturer = await Lecturer.create({
        userId: user._id,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        qualifications: data.qualifications,
        position: data.position || "Academic Lecturer",
        assignedModules: data.assignedModules || [],
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        status: "ACTIVE"
    });

    return { lecturer, defaultPassword };
};

// --- Timetable Management (with conflict detection) ---
export const createLectureSession = async (data: {
    batchNumber: string;
    subject: string;
    lecturer: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    sessionInfo?: string;
}) => {
    // Conflict 1: Check if room is already booked on the same date and overlapping time
    const roomConflict = await LectureSchedule.findOne({
        date: data.date,
        room: data.room,
        $or: [
            { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }
        ]
    });

    if (roomConflict) {
        throw new Error(`Room conflict: ${data.room} is already scheduled for ${roomConflict.subject} from ${roomConflict.startTime} to ${roomConflict.endTime}`);
    }

    // Conflict 2: Check if batch already has a lecture on the same date and overlapping time
    const batchConflict = await LectureSchedule.findOne({
        date: data.date,
        batchNumber: data.batchNumber,
        $or: [
            { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }
        ]
    });

    if (batchConflict) {
        throw new Error(`Batch conflict: ${data.batchNumber} already has ${batchConflict.subject} from ${batchConflict.startTime} to ${batchConflict.endTime}`);
    }

    // Conflict 3: Check if lecturer is already teaching another class at that time
    const lecturerConflict = await LectureSchedule.findOne({
        date: data.date,
        lecturer: data.lecturer,
        $or: [
            { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }
        ]
    });

    if (lecturerConflict) {
        throw new Error(`Lecturer conflict: ${data.lecturer} is already scheduled to teach in room ${lecturerConflict.room} from ${lecturerConflict.startTime} to ${lecturerConflict.endTime}`);
    }

    return await LectureSchedule.create(data);
};

export const getLectureSchedules = async (batchNumber?: string) => {
    const query: any = {};
    if (batchNumber && batchNumber !== "ALL" && batchNumber !== "All") {
        query.batchNumber = { $regex: new RegExp(`^${batchNumber.trim().replace(/[- ]+/g, "[- ]?")}$`, "i") };
    }
    return await LectureSchedule.find(query).sort({ date: 1, startTime: 1 });
};

// --- Attendance Management ---
export const recordBatchAttendance = async (
    lectureScheduleId: string,
    batchNumber: string,
    date: string,
    records: { studentId: string; studentName: string; status: AttendanceStatus }[],
    markedBy?: string
) => {
    const results = [];

    for (const rec of records) {
        const item = await Attendance.findOneAndUpdate(
            { lectureScheduleId, studentId: rec.studentId },
            {
                lectureScheduleId,
                batchNumber,
                studentId: rec.studentId,
                studentName: rec.studentName,
                status: rec.status,
                date,
                ...(markedBy ? { markedBy } : {})
            },
            { upsert: true, returnDocument: 'after' }
        );
        results.push(item);
    }

    return results;
};

export const getBatchAttendanceForLecture = async (lectureScheduleId: string) => {
    return await Attendance.find({ lectureScheduleId });
};

export const getAttendanceReports = async (batchNumber?: string) => {
    const query: any = {};
    if (batchNumber && batchNumber !== "ALL") {
        query.batchNumber = batchNumber;
    }

    const records = await Attendance.find(query);
    const totalRecords = records.length;
    const presentCount = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absentCount = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const lateCount = records.filter(r => r.status === AttendanceStatus.LATE).length;

    const rate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    return {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        rate
    };
};
