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

export const getPublicDepartmentsData = async () => {
    const departments = await Department.find({ isPublic: true });
    const lecturers = await Lecturer.find({ isPublic: true, status: "ACTIVE" });
    const websiteInfo = await PublicContent.findOne({ key: "website_info" });

    return {
        departments: departments.map(d => ({
            id: d.key,
            name: d.name,
            description: d.description,
            color: d.color,
            lecturers: lecturers
                .filter(l => l.departmentKey === d.key || (!l.departmentKey && d.key === "academic"))
                .map(l => ({
                    name: l.name,
                    position: l.position || "Staff Officer",
                    email: l.email
                }))
        })),
        leadership: websiteInfo?.data?.leadership || [
            { name: "Mr. Sanjeewa Samarasinghe", position: "Founder of IJSE", email: "founder@ijse.lk" },
            { name: "Dr. Prasanna Fernando", position: "Chief Executive Officer", email: "ceo@ijse.lk" }
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
