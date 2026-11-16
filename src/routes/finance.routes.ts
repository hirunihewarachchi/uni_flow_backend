import { Router } from "express";
import {
    handleGetFinanceOverview,
    handleGetStudentPayments,
    handleRecordPayment,
    handleCreatePaymentSession,
    handleVerifyPayment,
    handleGetTransactions,
    handleSendWarning,
    handleGetMyFinance
} from "../controllers/finance.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

// Student-accessible endpoint for personal finance & payment history
router.get("/my-finance", authenticate, handleGetMyFinance);

// Student creates online card checkout session
router.post("/online-payment/session", authenticate, handleCreatePaymentSession);

// Webhook / Verification endpoint
router.post("/online-payment/verify", handleVerifyPayment);

// Finance Department & Admin routes
router.get(
    "/overview",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.FINANCE_OFFICER),
    handleGetFinanceOverview
);

router.get(
    "/student-payments",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.FINANCE_OFFICER),
    handleGetStudentPayments
);

router.post(
    "/payments",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.FINANCE_OFFICER),
    handleRecordPayment
);

router.get(
    "/transactions",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.FINANCE_OFFICER),
    handleGetTransactions
);

router.post(
    "/warnings",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.FINANCE_OFFICER),
    handleSendWarning
);

export default router;
