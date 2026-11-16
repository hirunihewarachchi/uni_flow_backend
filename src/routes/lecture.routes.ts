
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getStudentLectureTimetable } from "../controllers/lecture.controller";

const router = Router();

// Authenticated students only
router.get(
    "/timetable",
    authenticate,
    getStudentLectureTimetable
);

export default router;
