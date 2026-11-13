import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model";

const generateToken = (userId: string, role: UserRole): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        {
            role: role
        },
        jwtSecret,
        {
            subject: userId,
            expiresIn: "1d"
        }
    );
};

export default generateToken;