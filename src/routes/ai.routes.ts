import { Router } from "express";
import {
    handleGetSkillGap,
    handleToggleAssignment,
    handleGetCareerRoadmap,
    handleConfirmCareer
} from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Skill Gap Analysis
router.get("/skill-gap", authenticate, handleGetSkillGap);
router.post("/skill-gap/toggle-assignment", authenticate, handleToggleAssignment);

// Career Roadmap
router.get("/career-roadmap", authenticate, handleGetCareerRoadmap);
router.post("/career-roadmap/confirm", authenticate, handleConfirmCareer);

export default router;
