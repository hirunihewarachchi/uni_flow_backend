import PublicContent from "../models/publicContent.model";
import Announcement from "../models/announcement.model";
import Course from "../models/course.model";
import Module from "../models/module.model";
import Department from "../models/department.model";
import Lecturer from "../models/lecturer.model";
import Student from "../models/student.model";
import Batch from "../models/batch.model";

export const getPublicDashboardData = async () => {
    const studentCount = await Student.countDocuments();
    const lecturerCount = await Lecturer.countDocuments({ status: "ACTIVE" });
    const programCount = await Course.countDocuments({ isPublished: true });
    const moduleCount = await Module.countDocuments();

    const announcements = await Announcement.find({ status: "PUBLISHED" })
        .sort({ date: -1 })
        .limit(5);

    const websiteInfo = await PublicContent.findOne({ key: "website_info" });

    return {
        statistics: [
            { title: "Total Students", value: studentCount || "1,250", description: "Registered students" },
            { title: "Total Lecturers", value: lecturerCount || "48", description: "Academic staff" },
            { title: "Programs", value: programCount || "04", description: "Available programs" },
            { title: "Modules", value: moduleCount || "27", description: "Academic modules" }
        ],
        announcements,
        websiteInfo: websiteInfo?.data || null
    };
};

const defaultDepartmentStaff: Record<string, { name: string; position: string; email: string }[]> = {
    marketing: [
        { name: "Mr. Nimal Perera", position: "Head of Marketing & Admissions", email: "marketing@ijse.lk" },
        { name: "Ms. Sanduni Jayawardena", position: "Senior Admissions Counselor", email: "sanduni.j@ijse.lk" },
        { name: "Mr. Thisara Senanayake", position: "Student Enrollment Coordinator", email: "thisara.s@ijse.lk" }
    ],
    academic: [
        { name: "Mr. Niroth Samarawickrama", position: "Head of Academic Affairs / Senior Lecturer", email: "niroth.s@ijse.lk" },
        { name: "Mr. Suranga Fernando", position: "Senior Lecturer - Enterprise Java & Cloud Systems", email: "suranga.f@ijse.lk" },
        { name: "Mr. Danuja Vimukthi", position: "Senior Lecturer - Modern Full Stack Engineering", email: "danuja.v@ijse.lk" },
        { name: "Mr. Janith Sandaruwan", position: "Lecturer - Data Structures & Mobile Development", email: "janith.s@ijse.lk" },
        { name: "Ms. Achini Wickramasinghe", position: "Lecturer - Database Systems & Business Analytics", email: "achini.w@ijse.lk" }
    ],
    exam: [
        { name: "Mr. Nuwan Bandara", position: "Head of Examination / Controller of Exams", email: "exam@ijse.lk" },
        { name: "Ms. Dilini Kaluarachchi", position: "Senior Examination Officer & Assessment Coordinator", email: "dilini.k@ijse.lk" },
        { name: "Mr. Rasika Gunawardana", position: "Examination Evaluation Specialist", email: "rasika.g@ijse.lk" }
    ],
    finance: [
        { name: "Mrs. Amali Fernando", position: "Head of Finance / Chief Financial Officer", email: "finance@ijse.lk" },
        { name: "Mr. Chathura Weerasinghe", position: "Senior Finance Officer & Student Accounts", email: "chathura.w@ijse.lk" },
        { name: "Ms. Rashmi Madushani", position: "Student Accounts & Billing Coordinator", email: "accounts@ijse.lk" }
    ]
};

export const getPublicDepartmentsData = async () => {
    let departments = await Department.find({ isPublic: true });
    if (!departments || departments.length === 0) {
        departments = [
            { key: "marketing", name: "Marketing Department", description: "Handles prospective student inquiries, admissions, and student registrations.", color: "bg-red-50 text-[#D71920]" },
            { key: "academic", name: "Academic Department", description: "Coordinates academic curricula, lecture schedules, batches, and student attendance.", color: "bg-blue-50 text-blue-700" },
            { key: "exam", name: "Exam Department", description: "Manages semester examinations, assessments, student marks, and official result publications.", color: "bg-purple-50 text-purple-700" },
            { key: "finance", name: "Finance Department", description: "Handles student fee schedules, payments, receipts, and financial reporting.", color: "bg-green-50 text-green-700" }
        ] as any;
    }

    const lecturers = await Lecturer.find({ isPublic: true, status: "ACTIVE" });
    const websiteInfo = await PublicContent.findOne({ key: "website_info" });

    return {
        departments: departments.map(d => {
            const dbLecturers = lecturers
                .filter(l => (l.departmentKey === d.key || (!l.departmentKey && d.key === "academic")) &&
                    l.name && !l.name.toLowerCase().includes("add staff") && !l.name.toLowerCase().includes("add lecturer"))
                .map(l => ({
                    name: l.name,
                    position: l.position || "Staff Officer",
                    email: l.email
                }));

            return {
                id: d.key,
                name: d.name,
                description: d.description,
                color: d.color,
                lecturers: dbLecturers.length > 0 ? dbLecturers : (defaultDepartmentStaff[d.key] || [])
            };
        }),
        leadership: websiteInfo?.data?.leadership || [
            { name: "Mr. Sanjeewa Samarasinghe", position: "Founder & Managing Director", email: "founder@ijse.lk" },
            { name: "Dr. Prasanna Fernando", position: "Chief Executive Officer (CEO)", email: "ceo@ijse.lk" }
        ]
    };
};

export const getPublicCoursesData = async () => {
    const courses = await Course.find({ isPublished: true });
    const modules = await Module.find();

    return courses.map(course => {
        const courseModules = modules.filter(m => m.courseCode === course.code);

        // Group by semester if HDSE
        const semesterGroups: Record<string, string[]> = {};
        if (course.code === "HDSE") {
            courseModules.forEach(m => {
                const sem = m.semester || "Semester 1";
                if (!semesterGroups[sem]) semesterGroups[sem] = [];
                semesterGroups[sem].push(`${m.name} (${m.code})`);
            });
        } else {
            semesterGroups["Course Modules"] = courseModules.map(m => `${m.name} (${m.code})`);
        }

        return {
            id: course.code,
            title: course.title,
            shortName: course.code,
            duration: course.duration,
            structure: course.structure,
            description: course.description,
            fee: course.fee,
            modules: Object.entries(semesterGroups).map(([semester, subjects]) => ({
                semester,
                subjects
            }))
        };
    });
};
