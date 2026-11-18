import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User, { UserRole } from "../models/user.model";

dotenv.config();

export const ensureSuperAdmin = async (): Promise<void> => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@uniflow.lk").trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        const existingAdmin = await User.findOne({
            $or: [
                { email: adminEmail },
                { role: UserRole.SUPER_ADMIN },
                { role: UserRole.ADMIN }
            ]
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                firstName: "System",
                lastName: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.SUPER_ADMIN,
                isActive: true
            });
            console.log(`Default Super Admin created: ${adminEmail}`);
        } else {
            let changed = false;
            if (!existingAdmin.isActive) {
                existingAdmin.isActive = true;
                changed = true;
            }
            if (existingAdmin.role !== UserRole.SUPER_ADMIN && existingAdmin.role !== UserRole.ADMIN) {
                existingAdmin.role = UserRole.SUPER_ADMIN;
                changed = true;
            }
            if (changed) {
                await existingAdmin.save();
                console.log("Admin account status/role updated.");
            }
        }
    } catch (err) {
        console.warn("Could not check/create default admin:", err);
    }
};

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully!");

        // Automatically ensure Super Admin exists in the connected database
        await ensureSuperAdmin();
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;