import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user.model";
import Course from "../models/course.model";
import Module from "../models/module.model";
import Batch, { BatchStatus } from "../models/batch.model";
import Department from "../models/department.model";
import PublicContent from "../models/publicContent.model";
import Announcement from "../models/announcement.model";
import Student, { StudentStatus } from "../models/student.model";
import PaymentSchedule from "../models/paymentSchedule.model";
import Examination from "../models/examination.model";
import ExaminationResult from "../models/result.model";
import LectureSchedule from "../models/lectureSchedule.model";
import Lecturer from "../models/lecturer.model";

export const seedMasterData = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/uniflow";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for master data seeding...");

        // 1. Seed Courses
        const courses = [
            {
                code: "HDSE",
                title: "Higher Diploma in Software Engineering",
                duration: "2 Years",
                structure: "4 Semesters",
                description: "Develop strong software engineering knowledge and practical skills through programming, databases, web development, software engineering, and advanced application development.",
                fee: 250000,
                isPublished: true
            },
            {
                code: "CMJD",
                title: "Comprehensive Master Java Developer",
                duration: "6 Months",
                structure: "Module-Based Programme",
                description: "An accelerated version of the software engineering curriculum focusing heavily on Java development, object-oriented concepts, database programming and enterprise architecture.",
                fee: 180000,
                isPublished: true
            },
            {
                code: "CAME",
                title: "Comprehensive Advanced Machine Learning Engineering",
                duration: "6 Months",
                structure: "AI Module-Based Programme",
                description: "Explore Artificial Intelligence, core machine learning, deep learning, computer vision, natural language processing, LLMs, MLOps, and Generative AI agents.",
                fee: 200000,
                isPublished: true
            },
            {
                code: "FOUNDATION",
                title: "Foundation Programme",
                duration: "6 Months",
                structure: "Module-Based Programme",
                description: "Build essential knowledge and practical skills in computing, programming, mathematics, communication, and problem-solving before progressing to advanced IT studies.",
                fee: 120000,
                isPublished: true
            }
        ];

        for (const c of courses) {
            await Course.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true });
        }
        console.log("Courses seeded.");

        // 2. Seed Modules (HDSE, CMJD, CAME)
        const hdseModules = [
            // Semester 1
            { code: "PRF", name: "Programming Fundamentals", semester: "Semester 1" },
            { code: "OOP", name: "Object Oriented Programming", semester: "Semester 1" },
            { code: "SPM", name: "Software Process Modeling", semester: "Semester 1" },
            { code: "IOH", name: "Input and Output (I/O) Handling", semester: "Semester 1" },
            { code: "MTP", name: "Multi-Threaded Programming", semester: "Semester 1" },
            // Semester 2
            { code: "DBMS", name: "Database Management Systems", semester: "Semester 2" },
            { code: "UXE", name: "Introduction to UX Engineering", semester: "Semester 2" },
            { code: "JDBC", name: "Database Programming with JDBC", semester: "Semester 2" },
            { code: "CASE", name: "Software Development with CASE Tools", semester: "Semester 2" },
            { code: "DSA1", name: "Data Structures and Algorithms I", semester: "Semester 2" },
            // Semester 3
            { code: "NPA", name: "Network Programming and Client-Server Architecture", semester: "Semester 3" },
            { code: "DP", name: "Design Patterns", semester: "Semester 3" },
            { code: "ADBMS", name: "Advanced Database Management System", semester: "Semester 3" },
            { code: "DSA2", name: "Data Structures and Algorithms II", semester: "Semester 3" },
            { code: "ISAD", name: "Application Development with Industrial Standards", semester: "Semester 3" },
            // Semester 4
            { code: "SEP", name: "Software Engineering Principles", semester: "Semester 4" },
            { code: "CSAD", name: "Client-Server Application Developments", semester: "Semester 4" },
            { code: "IT", name: "Internet Technologies", semester: "Semester 4" },
            { code: "ORM", name: "ORM Concepts with JPA/Hibernate", semester: "Semester 4" },
            { code: "GIT", name: "Version Control with Git/GitHub", semester: "Semester 4" }
        ];

        for (const m of hdseModules) {
            await Module.findOneAndUpdate(
                { courseCode: "HDSE", code: m.code },
                { ...m, courseCode: "HDSE", credits: 4 },
                { upsert: true, new: true }
            );
        }

        const cameModules = [
            { code: "AIML_FND", name: "AI & ML Engineering Foundations" },
            { code: "ML_CORE", name: "Core Machine Learning & Model Training" },
            { code: "ADV_ML", name: "Advanced Algorithms & Competitive ML" },
            { code: "DL_CV", name: "Deep Learning & Computer Vision" },
            { code: "NLP_LLM", name: "Natural Language Processing (NLP) & Large Language Models (LLMs)" },
            { code: "MLOPS", name: "MLOps" },
            { code: "GENAI", name: "Generative AI & AI Agents" }
        ];

        for (const m of cameModules) {
            await Module.findOneAndUpdate(
                { courseCode: "CAME", code: m.code },
                { ...m, courseCode: "CAME", credits: 4 },
                { upsert: true, new: true }
            );
        }
        console.log("Modules seeded.");

        // 3. Seed Batches
        const batches = [
            { batchNumber: "HDSE-75", courseCode: "HDSE", courseName: "Higher Diploma in Software Engineering", startDate: "2026-01-15", endDate: "2028-01-15", status: BatchStatus.ACTIVE },
            { batchNumber: "HDSE-76", courseCode: "HDSE", courseName: "Higher Diploma in Software Engineering", startDate: "2026-05-10", endDate: "2028-05-10", status: BatchStatus.ACTIVE },
            { batchNumber: "HDSE-77", courseCode: "HDSE", courseName: "Higher Diploma in Software Engineering", startDate: "2026-09-01", endDate: "2028-09-01", status: BatchStatus.UPCOMING },
            { batchNumber: "CMJD-01", courseCode: "CMJD", courseName: "Comprehensive Master Java Developer", startDate: "2026-02-01", endDate: "2026-08-01", status: BatchStatus.ACTIVE },
            { batchNumber: "CAME-01", courseCode: "CAME", courseName: "Comprehensive Advanced Machine Learning Engineering", startDate: "2026-03-01", endDate: "2026-09-01", status: BatchStatus.ACTIVE }
        ];

        for (const b of batches) {
            await Batch.findOneAndUpdate({ batchNumber: b.batchNumber }, b, { upsert: true, new: true });
        }
        console.log("Batches seeded.");

        // 4. Seed Departments
        const departments = [
            { key: "marketing", name: "Marketing Department", description: "Handles prospective student inquiries, admissions, and student registrations.", color: "bg-red-50 text-[#D71920]" },
            { key: "academic", name: "Academic Department", description: "Coordinates academic curricula, lecture schedules, batches, and student attendance.", color: "bg-blue-50 text-blue-700" },
            { key: "exam", name: "Exam Department", description: "Manages examinations, assessments, student marks, and official result publications.", color: "bg-purple-50 text-purple-700" },
            { key: "finance", name: "Finance Department", description: "Handles student fee schedules, payments, receipts, and financial reporting.", color: "bg-green-50 text-green-700" }
        ];

        for (const d of departments) {
            await Department.findOneAndUpdate({ key: d.key }, d, { upsert: true, new: true });
        }
        console.log("Departments seeded.");

        // 5. Seed Public Website Content
        await PublicContent.findOneAndUpdate(
            { key: "website_info" },
            {
                key: "website_info",
                data: {
                    instituteName: "IJSE",
                    tagline: "Sri Lanka's No. 1 Software Engineering Institute",
                    heroTitle: "Build Your Future in Software Engineering",
                    heroDescription: "Start your journey towards becoming a professional software engineer with Sri Lanka's leading institute.",
                    aboutTitle: "About IJSE",
                    aboutDescription: "IJSE provides professional software engineering education and industry-focused training that bridges academic knowledge with enterprise software development.",
                    email: "info@ijse.lk",
                    phone: "+94 11 234 5678",
                    address: "Panadura / Colombo, Sri Lanka",
                    leadership: [
                        { name: "Mr. Sanjeewa Samarasinghe", position: "Founder of IJSE", email: "founder@ijse.lk" },
                        { name: "Dr. Prasanna Fernando", position: "Chief Executive Officer", email: "ceo@ijse.lk" }
                    ]
                }
            },
            { upsert: true, new: true }
        );

        // 6. Seed Announcements
        const announcements = [
            {
                title: "New HDSE 77 Intake Now Open",
                description: "Applications are now open for the upcoming Higher Diploma in Software Engineering intake.",
                date: "2026-11-15",
                status: "PUBLISHED",
                targetAudience: "ALL"
            },
            {
                title: "Semester Examination Schedule Released",
                description: "The official examination timetable for HDSE 75 and 76 has been published in the student portal.",
                date: "2026-11-14",
                status: "PUBLISHED",
                targetAudience: "STUDENTS"
            }
        ];

        for (const a of announcements) {
            await Announcement.findOneAndUpdate({ title: a.title }, a, { upsert: true, new: true });
        }
        console.log("Announcements seeded.");

        // 7. Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL || "admin@uniflow.lk";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

        await User.findOneAndUpdate(
            { email: adminEmail.toLowerCase() },
            {
                firstName: "System",
                lastName: "Administrator",
                email: adminEmail.toLowerCase(),
                password: hashedAdminPassword,
                role: UserRole.ADMIN,
                isActive: true
            },
            { upsert: true, new: true }
        );

        // 8. Seed Real Department Officers & Academic Lecturers
        const officers = [
            { firstName: "Nimal", lastName: "Perera", email: "marketing@ijse.lk", role: UserRole.MARKETING, department: "MARKETING", position: "Head of Marketing & Admissions", phone: "+94 11 234 5671", departmentKey: "marketing" },
            { firstName: "Kasun", lastName: "Silva", email: "academic@ijse.lk", role: UserRole.ACADEMIC, department: "ACADEMIC", position: "Academic Coordinator", phone: "+94 11 234 5672", departmentKey: "academic" },
            { firstName: "Amali", lastName: "Fernando", email: "finance@ijse.lk", role: UserRole.FINANCE, department: "FINANCE", position: "Head of Finance / CFO", phone: "+94 11 234 5673", departmentKey: "finance" },
            { firstName: "Nuwan", lastName: "Bandara", email: "exam@ijse.lk", role: UserRole.EXAM, department: "EXAM", position: "Head of Examination / Controller of Exams", phone: "+94 11 234 5674", departmentKey: "exam" },
            { firstName: "Niroth", lastName: "Samarawickrama", email: "niroth.s@ijse.lk", role: UserRole.LECTURER, department: "ACADEMIC", position: "Head of Academic Affairs / Senior Lecturer", phone: "+94 11 234 5675", departmentKey: "academic", assignedModules: ["OOP", "SE"] },
            { firstName: "Suranga", lastName: "Fernando", email: "suranga.f@ijse.lk", role: UserRole.LECTURER, department: "ACADEMIC", position: "Senior Lecturer - Enterprise Java & Cloud Systems", phone: "+94 11 234 5676", departmentKey: "academic", assignedModules: ["OOP", "EAD"] },
            { firstName: "Danuja", lastName: "Vimukthi", email: "danuja.v@ijse.lk", role: UserRole.LECTURER, department: "ACADEMIC", position: "Senior Lecturer - Modern Full Stack Engineering", phone: "+94 11 234 5677", departmentKey: "academic", assignedModules: ["WEB", "PRF"] },
            { firstName: "Janith", lastName: "Sandaruwan", email: "janith.s@ijse.lk", role: UserRole.LECTURER, department: "ACADEMIC", position: "Lecturer - Data Structures & Mobile Development", phone: "+94 11 234 5678", departmentKey: "academic", assignedModules: ["PRF"] },
            { firstName: "Achini", lastName: "Wickramasinghe", email: "achini.w@ijse.lk", role: UserRole.LECTURER, department: "ACADEMIC", position: "Lecturer - Database Systems & Business Analytics", phone: "+94 11 234 5679", departmentKey: "academic", assignedModules: ["DBMS"] }
        ];

        for (const off of officers) {
            const hash = await bcrypt.hash("officer123", 12);
            const user = await User.findOneAndUpdate(
                { email: off.email.toLowerCase() },
                {
                    firstName: off.firstName,
                    lastName: off.lastName,
                    email: off.email.toLowerCase(),
                    password: hash,
                    role: off.role,
                    department: off.department,
                    isActive: true
                },
                { upsert: true, new: true }
            );

            await Lecturer.findOneAndUpdate(
                { email: off.email.toLowerCase() },
                {
                    userId: user._id,
                    name: `${off.firstName} ${off.lastName}`,
                    email: off.email.toLowerCase(),
                    phone: off.phone,
                    position: off.position,
                    departmentKey: off.departmentKey,
                    assignedModules: off.assignedModules || [],
                    isPublic: true,
                    status: "ACTIVE"
                },
                { upsert: true, new: true }
            );
        }
        console.log("Real officers and lecturers seeded.");

        // 9. Seed Sample Student Account
        // Format: ID "HDSE75-00001", Institutional email "hiruni,hdse75@ijse.com"
        const studentId = "HDSE75-00001";
        const institutionalEmail = "hiruni,hdse75@ijse.com";
        const studentPasswordHash = await bcrypt.hash(studentId, 12); // Initial password is the generated student ID

        const studentUser = await User.findOneAndUpdate(
            { email: institutionalEmail },
            {
                firstName: "Hiruni",
                lastName: "Hewaarachchi",
                email: institutionalEmail,
                institutionalId: institutionalEmail,
                password: studentPasswordHash,
                role: UserRole.STUDENT,
                isActive: true,
                mustChangePassword: true, // Requires first login password change
                studentId: studentId
            },
            { upsert: true, new: true }
        );

        await Student.findOneAndUpdate(
            { email: "hiruni@example.com" },
            {
                registrationNumber: studentId,
                studentId: studentId,
                institutionalId: institutionalEmail,
                firstName: "Hiruni",
                lastName: "Hewaarachchi",
                email: "hiruni@example.com",
                phone: "0771234567",
                courseCode: "HDSE",
                batchNumber: "HDSE-75",
                status: StudentStatus.ACTIVATED,
                userId: studentUser._id
            },
            { upsert: true, returnDocument: 'after' }
        );

        // Also add Kamal (STU001) for SkillGap demo comparison
        const kamalId = "HDSE75-00002";
        const kamalEmail = "kamal,hdse75@ijse.com";
        const kamalHash = await bcrypt.hash(kamalId, 12);

        const kamalUser = await User.findOneAndUpdate(
            { email: kamalEmail },
            {
                firstName: "Kamal",
                lastName: "Perera",
                email: kamalEmail,
                institutionalId: kamalEmail,
                password: kamalHash,
                role: UserRole.STUDENT,
                isActive: true,
                mustChangePassword: false,
                studentId: kamalId
            },
            { upsert: true, returnDocument: 'after' }
        );

        await Student.findOneAndUpdate(
            { email: "kamal@example.com" },
            {
                registrationNumber: kamalId,
                studentId: kamalId,
                institutionalId: kamalEmail,
                firstName: "Kamal",
                lastName: "Perera",
                email: "kamal@example.com",
                phone: "0711234567",
                courseCode: "HDSE",
                batchNumber: "HDSE-75",
                status: StudentStatus.ACTIVATED,
                userId: kamalUser._id
            },
            { upsert: true, returnDocument: 'after' }
        );

        // 10. Seed Sample Financial Records for Hiruni
        await PaymentSchedule.findOneAndUpdate(
            { studentId: studentId },
            {
                studentId: studentId,
                studentName: "Hiruni Hewaarachchi",
                batchNumber: "HDSE-75",
                courseCode: "HDSE",
                courseName: "Higher Diploma in Software Engineering",
                planType: "semester",
                totalFee: 240000,
                paidAmount: 60000,
                status: "PARTIAL",
                nextDueDate: "2026-12-15",
                nextDueAmount: 60000
            },
            { upsert: true, new: true }
        );

        // 11. Seed Sample Examination & Results for Hiruni & Kamal
        const sampleExams = [
            { batchNumber: "HDSE-75", subject: "Programming Fundamentals (PRF)", examType: "Final Examination", date: "2026-11-25", startTime: "09:00 AM", endTime: "12:00 PM", duration: "3 Hours", venue: "Lab 01", status: "Upcoming", isPublished: true },
            { batchNumber: "HDSE-75", subject: "Object Oriented Programming (OOP)", examType: "Final Examination", date: "2026-11-27", startTime: "09:00 AM", endTime: "12:00 PM", duration: "3 Hours", venue: "Hall A", status: "Upcoming", isPublished: true },
            { batchNumber: "HDSE-75", subject: "Database Management Systems (DBMS)", examType: "Final Examination", date: "2026-11-30", startTime: "01:00 PM", endTime: "04:00 PM", duration: "3 Hours", venue: "Lab 02", status: "Upcoming", isPublished: true }
        ];

        for (const ex of sampleExams) {
            await Examination.findOneAndUpdate(
                { batchNumber: ex.batchNumber, subject: ex.subject, examType: ex.examType },
                ex,
                { upsert: true, new: true }
            );
        }

        // Seed Hiruni's results (matching frontend sample: PRF: 50, OOP: 40, DBMS: 32)
        const hiruniResults = [
            { studentId: studentId, studentName: "Hiruni Hewaarachchi", batchNumber: "HDSE-75", subject: "Programming Fundamentals (PRF)", moduleCode: "PRF", semester: "Semester 1", examType: "Final Examination", examDate: "2026-09-15", marks: 50, totalMarks: 100, grade: "S", status: "Passed", isPublished: true },
            { studentId: studentId, studentName: "Hiruni Hewaarachchi", batchNumber: "HDSE-75", subject: "Object Oriented Programming (OOP)", moduleCode: "OOP", semester: "Semester 1", examType: "Final Examination", examDate: "2026-09-17", marks: 40, totalMarks: 100, grade: "S", status: "Passed", isPublished: true },
            { studentId: studentId, studentName: "Hiruni Hewaarachchi", batchNumber: "HDSE-75", subject: "Database Management Systems (DBMS)", moduleCode: "DBMS", semester: "Semester 2", examType: "Final Examination", examDate: "2026-10-10", marks: 32, totalMarks: 100, grade: "F", status: "Failed", isPublished: true }
        ];

        for (const res of hiruniResults) {
            await ExaminationResult.findOneAndUpdate(
                { studentId: res.studentId, subject: res.subject, examType: res.examType },
                res,
                { upsert: true, new: true }
            );
        }

        // Seed Kamal's results (PRF: 90, OOP: 75, DBMS: 40)
        const kamalResults = [
            { studentId: kamalId, studentName: "Kamal Perera", batchNumber: "HDSE-75", subject: "Programming Fundamentals (PRF)", moduleCode: "PRF", semester: "Semester 1", examType: "Final Examination", examDate: "2026-09-15", marks: 90, totalMarks: 100, grade: "A+", status: "Passed", isPublished: true },
            { studentId: kamalId, studentName: "Kamal Perera", batchNumber: "HDSE-75", subject: "Object Oriented Programming (OOP)", moduleCode: "OOP", semester: "Semester 1", examType: "Final Examination", examDate: "2026-09-17", marks: 75, totalMarks: 100, grade: "A", status: "Passed", isPublished: true },
            { studentId: kamalId, studentName: "Kamal Perera", batchNumber: "HDSE-75", subject: "Database Management Systems (DBMS)", moduleCode: "DBMS", semester: "Semester 2", examType: "Final Examination", examDate: "2026-10-10", marks: 40, totalMarks: 100, grade: "S", status: "Passed", isPublished: true }
        ];

        for (const res of kamalResults) {
            await ExaminationResult.findOneAndUpdate(
                { studentId: res.studentId, subject: res.subject, examType: res.examType },
                res,
                { upsert: true, new: true }
            );
        }

        // 12. Seed Lecture Schedules
        const sampleLectures = [
            { batchNumber: "HDSE-75", subject: "Programming Fundamentals (PRF)", lecturer: "Kasun Perera", date: "2026-11-16", startTime: "09:00", endTime: "12:00", room: "Lab 01" },
            { batchNumber: "HDSE-75", subject: "Database Management Systems", lecturer: "Nuwan Silva", date: "2026-11-16", startTime: "13:00", endTime: "16:00", room: "Hall 02" },
            { batchNumber: "HDSE-76", subject: "Object Oriented Programming (OOP)", lecturer: "Tharindu Fernando", date: "2026-11-17", startTime: "09:00", endTime: "12:00", room: "Lab 02" }
        ];

        for (const l of sampleLectures) {
            await LectureSchedule.findOneAndUpdate(
                { batchNumber: l.batchNumber, subject: l.subject, date: l.date, startTime: l.startTime },
                l,
                { upsert: true, new: true }
            );
        }

        console.log("Master seed completed successfully!");
    } catch (error) {
        console.error("Master seed error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

if (require.main === module) {
    seedMasterData();
}
