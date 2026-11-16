import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user.model";
import Student from "../models/student.model";
import RecoveryCode from "../models/recoveryCode.model";
import generateToken from "../utils/token";
import { sendRecoveryCodeEmail } from "../utils/mailer";

// Register a new student
const registerUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    studentId?: string;
    institutionalId?: string;
}) => {
    const { firstName, lastName, email, password, phone, role, studentId, institutionalId } = userData;

    // Check whether the email already exists
    const existingUser = await User.findOne({
        email: email.trim().toLowerCase()
    });

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await User.create({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        phone,
        role: role || UserRole.STUDENT,
        studentId,
        institutionalId
    });

    // Generate JWT token
    const token = generateToken(
        newUser._id.toString(),
        newUser.role
    );

    // Never return the password
    return {
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            studentId: newUser.studentId,
            mustChangePassword: newUser.mustChangePassword
        },
        token
    };
};

// Login an existing user (supports personal email OR institutional login identifier)
const loginUser = async (identifier: string, password: string) => {
    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by email or institutionalId
    const user = await User.findOne({
        $or: [
            { email: cleanIdentifier },
            { institutionalId: cleanIdentifier }
        ]
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check account status
    if (!user.isActive) {
        throw new Error("Your account is inactive. Please contact administration.");
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Normalize role string so frontend receives canonical role
    let role = user.role;
    if (role === UserRole.SUPER_ADMIN) role = UserRole.ADMIN;
    if (role === UserRole.MARKETING_OFFICER) role = UserRole.MARKETING;
    if (role === UserRole.ACADEMIC_OFFICER) role = UserRole.ACADEMIC;
    if (role === UserRole.FINANCE_OFFICER) role = UserRole.FINANCE;
    if (role === UserRole.EXAM_OFFICER) role = UserRole.EXAM;

    // Generate JWT token
    const token = generateToken(
        user._id.toString(),
        user.role
    );

    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: role,
            mustChangePassword: !!user.mustChangePassword,
            studentId: user.studentId
        },
        token
    };
};

// First login password change
const firstLoginPasswordChange = async (userId: string, newPassword: string) => {
    if (newPassword.length < 6) {
        throw new Error("Password must contain at least 6 characters");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();

    return { success: true, message: "Password updated successfully" };
};

// Change password
const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    if (newPassword.length < 6) {
        throw new Error("Password must contain at least 6 characters");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password changed successfully" };
};

const maskEmail = (email: string): string => {
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) {
        return `${name[0]}*@${domain}`;
    }
    const visibleChars = Math.min(2, Math.floor(name.length / 3));
    const start = name.substring(0, visibleChars);
    const end = name.substring(name.length - 1);
    const hidden = "*".repeat(Math.max(name.length - visibleChars - 1, 3));
    return `${start}${hidden}${end}@${domain}`;
};

// Forgot password - sends 6-digit recovery code to the student's real email address
const forgotPassword = async (identifier: string) => {
    const clean = identifier.trim().toLowerCase();

    // 1. Search User by email, institutionalId, or studentId
    let user = await User.findOne({
        $or: [
            { email: clean },
            { institutionalId: clean },
            { studentId: clean }
        ]
    });

    // 2. Search Student record (to get student's real personal email address)
    let student = await Student.findOne({
        $or: [
            { email: clean },
            { institutionalId: clean },
            { studentId: clean },
            { registrationNumber: clean },
            ...(user ? [{ userId: user._id }] : [])
        ]
    });

    if (student && !user && student.userId) {
        user = await User.findById(student.userId);
    }

    if (!user && !student) {
        throw new Error("No registered account found with that email or login identifier.");
    }

    // Determine the real email address to receive the recovery code:
    // If student has a personal email recorded in Student, send to that!
    // Otherwise fallback to user.email
    const targetRealEmail = (student && student.email) ? student.email : (user ? user.email : clean);
    const studentName = student ? `${student.firstName} ${student.lastName}`.trim() : (user ? `${user.firstName} ${user.lastName}`.trim() : "Student");

    // Ensure we have a valid User ID
    if (!user) {
        throw new Error("Linked user account could not be found.");
    }

    // Generate secure 6-digit recovery code
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate existing unused recovery codes for this user
    await RecoveryCode.deleteMany({ userId: user._id });

    // Store new recovery code with 15-minute expiration
    await RecoveryCode.create({
        userId: user._id,
        identifier: clean,
        realEmail: targetRealEmail.toLowerCase(),
        code: recoveryCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        used: false
    });

    // Dispatch email
    const mailResult = await sendRecoveryCodeEmail({
        toEmail: targetRealEmail,
        studentName,
        recoveryCode,
        identifier: clean
    });

    return {
        success: true,
        message: `Recovery code has been sent to your registered email address (${maskEmail(targetRealEmail)}).`,
        realEmailMasked: maskEmail(targetRealEmail),
        realEmail: targetRealEmail,
        previewCode: mailResult.isDevFallback ? recoveryCode : undefined
    };
};

// Reset password using the 6-digit recovery code
const resetPasswordWithCode = async (identifier: string, code: string, newPassword: string) => {
    if (!identifier || !code || !newPassword) {
        throw new Error("Identifier, recovery code, and new password are required.");
    }

    if (newPassword.length < 6) {
        throw new Error("New password must contain at least 6 characters.");
    }

    const clean = identifier.trim().toLowerCase();

    // Look up user
    let user = await User.findOne({
        $or: [
            { email: clean },
            { institutionalId: clean },
            { studentId: clean }
        ]
    });

    if (!user) {
        const student = await Student.findOne({
            $or: [
                { email: clean },
                { institutionalId: clean },
                { studentId: clean },
                { registrationNumber: clean }
            ]
        });
        if (student && student.userId) {
            user = await User.findById(student.userId);
        }
    }

    if (!user) {
        throw new Error("User account not found.");
    }

    // Look up active RecoveryCode
    const recoveryRecord = await RecoveryCode.findOne({
        userId: user._id,
        code: code.trim(),
        used: false,
        expiresAt: { $gt: new Date() }
    });

    if (!recoveryRecord) {
        throw new Error("Invalid or expired recovery code. Please request a new code.");
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();

    // Mark code as used
    recoveryRecord.used = true;
    await recoveryRecord.save();

    return {
        success: true,
        message: "Your password has been reset successfully! You can now log in with your new password."
    };
};

export {
    registerUser,
    loginUser,
    firstLoginPasswordChange,
    changePassword,
    forgotPassword,
    resetPasswordWithCode
};