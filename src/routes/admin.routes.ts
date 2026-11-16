import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import User, { UserRole } from "../models/user.model";
import {
    getOverview,
    getStaff,
    createStaff,
    toggleStaffStatus,
    resetStaffPassword,
    deleteStaff,
    getWebsite,
    updateWebsite,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getActivity
} from "../controllers/admin.controller";

const router = Router();

// Protect all admin routes with authentication and ADMIN / SUPER_ADMIN role
// In development, if no authorization header is supplied, auto-authenticate as the default Admin
const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization && process.env.NODE_ENV !== "production") {
        try {
            const adminUser = await User.findOne({ role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } });
            if (adminUser) {
                req.user = {
                    userId: adminUser._id.toString(),
                    role: adminUser.role
                };
                return next();
            }
        } catch {
            // fall through to normal auth
        }
    }
    return authenticate(req, res, () => {
        authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)(req, res, next);
    });
};

router.use(adminAuth);


// Overview & Dashboard
router.get("/overview", getOverview);
router.get("/dashboard", getOverview);

// Staff management
router.get("/staff", getStaff);
router.post("/staff", createStaff);
router.put("/staff/:id/status", toggleStaffStatus);
router.post("/staff/:id/reset-password", resetStaffPassword);
router.delete("/staff/:id", deleteStaff);

// Website content management
router.get("/website", getWebsite);
router.put("/website", updateWebsite);

// Announcements
router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

// Courses
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Activity logs
router.get("/activity", getActivity);

export default router;