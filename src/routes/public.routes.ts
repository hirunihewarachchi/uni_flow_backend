import { Router } from "express";
import {
    getPublicDashboard,
    getPublicDepartments,
    getPublicCourses
} from "../controllers/public.controller";

const router = Router();

router.get("/dashboard", getPublicDashboard);
router.get("/departments", getPublicDepartments);
router.get("/courses", getPublicCourses);

export default router;
