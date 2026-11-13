
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user.model";

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully!");

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error("Admin credentials are missing in .env");
        }

        const existingAdmin = await User.findOne({
            email: adminEmail.toLowerCase()
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            firstName: "System",
            lastName: "Admin",
            email: adminEmail.toLowerCase(),
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
            isActive: true
        });

        console.log("Super Admin created successfully!");

    } catch (error) {
        console.error("Admin creation failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
