import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.post("/mark-all-read", markAllAsRead);

export default router;
