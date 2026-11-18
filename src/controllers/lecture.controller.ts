
import { Request, Response } from "express";
import Student, { StudentStatus } from "../models/student.model";
import LectureSchedule from "../models/lectureSchedule.model";
import User, { UserRole } from "../models/user.model";
import Batch from "../models/batch.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getStudentLectureTimetable = async (
    req: Request,
    res: Response
) => {
    try {
        const authReq = req as AuthRequest;

        // 1. Check authenticated user
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Fetch dynamic batches from Batch collection & LectureSchedule collection
        const batchDocs = await Batch.find().select("batchNumber").lean();
        const distinctLectureBatches = await LectureSchedule.distinct("batchNumber");
        const availableBatches = Array.from(new Set([
            ...batchDocs.map(b => b.batchNumber),
            ...distinctLectureBatches
        ].filter(Boolean)));

        // 2. Staff & Admin Access (Lecturer, Academic, Admin, Super Admin)
        if (authReq.user.role !== UserRole.STUDENT) {
            const requestedBatch = (req.query.batchNumber as string) || (availableBatches[0] || "ALL");
            const query = (!requestedBatch || requestedBatch === "ALL")
                ? {}
                : { batchNumber: { $regex: new RegExp(`^${requestedBatch.trim().replace(/[- ]+/g, "[- ]?")}$`, "i") } };

            const lectures = await LectureSchedule.find(query)
                .sort({ date: 1, startTime: 1 })
                .lean();

            return res.status(200).json({
                success: true,
                message: "Lecture timetable retrieved successfully",
                data: {
                    batchNumber: requestedBatch,
                    studentId: "STAFF_VIEW",
                    lectures,
                    availableBatches
                }
            });
        }

        // 3. Find the student using userId, email, or studentId
        let student = await Student.findOne({
            userId: authReq.user.userId
        });

        if (!student) {
            const user = await User.findById(authReq.user.userId);
            if (user) {
                student = await Student.findOne({
                    $or: [
                        { email: user.email },
                        { institutionalId: user.email },
                        ...(user.studentId ? [{ studentId: user.studentId }] : [])
                    ]
                });

                if (student) {
                    student.userId = user._id;
                    if (student.status !== StudentStatus.ACTIVATED) {
                        student.status = StudentStatus.ACTIVATED;
                    }
                    if (!student.batchNumber && user.batchNumber) {
                        student.batchNumber = user.batchNumber;
                    }
                    await student.save();
                } else {
                    // Auto-generate profile for active student user if not yet seeded
                    student = await Student.create({
                        userId: user._id,
                        studentId: user.studentId || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
                        firstName: user.firstName || "Student",
                        lastName: user.lastName || "Member",
                        email: user.email,
                        batchNumber: user.batchNumber || (availableBatches[0] || ""),
                        status: StudentStatus.ACTIVATED
                    });
                }
            }
        }

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile could not be found"
            });
        }

        // 4. Ensure student account activation and batch assignment
        if (student.status !== StudentStatus.ACTIVATED) {
            student.status = StudentStatus.ACTIVATED;
            await student.save();
        }

        if (!student.batchNumber) {
            const user = await User.findById(authReq.user.userId);
            if (user?.batchNumber) {
                student.batchNumber = user.batchNumber;
                await student.save();
            }
        }

        // 5. Retrieve ONLY student's own batch lectures (Strict scoping, no hardcoded fallback)
        let lectures: any[] = [];
        const studentBatch = (student.batchNumber || "").trim();
        if (studentBatch) {
            const batchRegex = new RegExp(`^${studentBatch.replace(/[- ]+/g, "[- ]?")}$`, "i");
            lectures = await LectureSchedule.find({
                batchNumber: { $regex: batchRegex }
            })
                .sort({ date: 1, startTime: 1 })
                .lean();
        }

        // 6. Return timetable strictly for student's batch
        return res.status(200).json({
            success: true,
            message: "Lecture timetable retrieved successfully",
            data: {
                batchNumber: student.batchNumber || "UNASSIGNED",
                studentId: student.studentId,
                lectures,
                availableBatches
            }
        });

    } catch (error) {
        console.error("Lecture timetable error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve lecture timetable"
        });
    }
};
