import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user.model";
import Student from "../models/student.model";
import Batch, { BatchStatus } from "../models/batch.model";
import Course from "../models/course.model";
import Announcement from "../models/announcement.model";
import PublicContent from "../models/publicContent.model";
import PaymentTransaction from "../models/paymentTransaction.model";
import ActivityLog from "../models/activityLog.model";

export const getAdminOverview = async () => {
    const studentCount = await Student.countDocuments();
    const staffCount = await User.countDocuments({ role: { $ne: UserRole.STUDENT } });
    const batchCount = await Batch.countDocuments({ status: BatchStatus.ACTIVE });

    // Calculate revenue
    const transactions = await PaymentTransaction.find({ status: "SUCCESS" as any });
    const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = transactions.filter(tx => {
        const d = (tx as any).createdAt ? new Date((tx as any).createdAt) : new Date(tx.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlyTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const recentActivities = await ActivityLog.find()
        .sort({ timestamp: -1 })
        .limit(10);

    return {
        stats: {
            totalStudents: studentCount,
            staffMembers: staffCount,
            activeBatches: batchCount,
            totalRevenue,
            monthlyRevenue
        },
        recentActivities
    };
};

export const getStaffList = async () => {
    const staff = await User.find({ role: { $ne: UserRole.STUDENT } })
        .select("-password")
        .sort({ createdAt: -1 });

    return staff.map(s => ({
        id: s._id.toString(),
        _id: s._id.toString(),
        name: `${s.firstName} ${s.lastName}`.trim(),
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        role: s.role,
        phone: s.phone || "",
        status: s.isActive ? "ACTIVE" : "INACTIVE"
    }));
};

export const createStaff = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: UserRole;
    password?: string;
}) => {
    const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
        throw new Error("A user with this email already exists");
    }

    const rawPassword = (data.password && data.password.trim()) || "Staff@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await User.create({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim(),
        role: data.role,
        password: hashedPassword,
        isActive: true,
        mustChangePassword: true
    });

    await ActivityLog.create({
        userId: newUser._id,
        userEmail: newUser.email,
        role: newUser.role,
        action: "STAFF_CREATED",
        details: `Created new staff account for ${newUser.firstName} ${newUser.lastName} with role ${newUser.role}`
    });

    return {
        id: newUser._id.toString(),
        _id: newUser._id.toString(),
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        status: "ACTIVE",
        temporaryPassword: rawPassword
    };
};


export const toggleStaffStatus = async (id: string) => {
    const staff = await User.findById(id);
    if (!staff) {
        throw new Error("Staff member not found");
    }

    staff.isActive = !staff.isActive;
    await staff.save();

    await ActivityLog.create({
        userId: staff._id,
        userEmail: staff.email,
        role: staff.role,
        action: "STAFF_STATUS_UPDATED",
        details: `Toggled status to ${staff.isActive ? "ACTIVE" : "INACTIVE"}`
    });

    return {
        id: staff._id,
        status: staff.isActive ? "ACTIVE" : "INACTIVE"
    };
};

export const resetStaffPassword = async (id: string, newPassword?: string) => {
    const staff = await User.findById(id);
    if (!staff) {
        throw new Error("Staff member not found");
    }

    const pass = newPassword || "Staff@123";
    staff.password = await bcrypt.hash(pass, 10);
    staff.mustChangePassword = true;
    await staff.save();

    await ActivityLog.create({
        userId: staff._id,
        userEmail: staff.email,
        role: staff.role,
        action: "PASSWORD_RESET",
        details: `Password reset by Admin for ${staff.email}`
    });

    return { message: "Password reset successfully", temporaryPassword: pass };
};

export const deleteStaff = async (id: string) => {
    const staff = await User.findByIdAndDelete(id);
    if (!staff) {
        throw new Error("Staff member not found");
    }

    await ActivityLog.create({
        userEmail: staff.email,
        role: staff.role,
        action: "STAFF_DELETED",
        details: `Staff member ${staff.email} deleted by Admin`
    });

    return { message: "Staff member deleted successfully" };
};

export const getWebsiteContent = async () => {
    let content = await PublicContent.findOne({ key: "website_info" });
    if (!content) {
        content = await PublicContent.create({
            key: "website_info",
            data: {
                instituteName: "IJSE",
                tagline: "Sri Lanka's No. 1 Software Engineering Institute",
                heroTitle: "Build Your Future in Software Engineering",
                heroDescription: "Start your journey towards becoming a professional software engineer with industry recognized courses.",
                address: "423/1, Pannipitiya Road, Pelawatta, Battaramulla",
                phone: "+94 11 2 777 555",
                email: "info@ijse.lk"
            }
        });
    }
    return content.data;
};

export const updateWebsiteContent = async (data: any) => {
    const content = await PublicContent.findOneAndUpdate(
        { key: "website_info" },
        {
            $set: {
                data
            }
        },
        { upsert: true, new: true }
    );

    await ActivityLog.create({
        action: "WEBSITE_CONTENT_UPDATED",
        details: "Admin updated public website information"
    });

    return content?.data || data;
};

export const getAllAnnouncements = async () => {
    return await Announcement.find().sort({ createdAt: -1 });
};

export const createAnnouncement = async (data: {
    title: string;
    description?: string;
    content?: string;
    status?: "DRAFT" | "PUBLISHED";
}) => {
    const announcement = await Announcement.create({
        title: data.title,
        description: data.description || data.content || "",
        status: data.status || "PUBLISHED",
        date: new Date().toISOString().slice(0, 10),
        targetAudience: "ALL"
    });

    await ActivityLog.create({
        action: "ANNOUNCEMENT_CREATED",
        details: `New announcement created: ${announcement.title}`
    });

    return announcement;
};

export const updateAnnouncement = async (id: string, data: any) => {
    const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true });
    if (!announcement) throw new Error("Announcement not found");
    return announcement;
};

export const deleteAnnouncement = async (id: string) => {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new Error("Announcement not found");
    return { message: "Announcement deleted successfully" };
};

export const getAdminCourses = async () => {
    return await Course.find().sort({ createdAt: -1 });
};

export const createAdminCourse = async (data: any) => {
    const course = await Course.create(data);
    await ActivityLog.create({
        action: "COURSE_CREATED",
        details: `Course created: ${course.code} - ${course.title}`
    });
    return course;
};

export const updateAdminCourse = async (id: string, data: any) => {
    const course = await Course.findByIdAndUpdate(id, data, { new: true });
    if (!course) throw new Error("Course not found");
    return course;
};

export const deleteAdminCourse = async (id: string) => {
    const course = await Course.findByIdAndDelete(id);
    if (!course) throw new Error("Course not found");
    return { message: "Course deleted successfully" };
};

export const getActivityLogs = async () => {
    return await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
};
