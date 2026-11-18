
import type { Request, Response } from "express";
import app from "../src/app";
import connectDB from "../src/config/db";

export default async function handler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        // Connect to MongoDB
        await connectDB();

        // Handle request using Express
        await app(req, res);

    } catch (error) {
        console.error("Vercel function error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}
