import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user.model";
import generateToken from "../utils/token";

// Register a new student
const registerUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}) => {

    const { firstName, lastName, email, password, phone } = userData;

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
        email,
        password: hashedPassword,
        phone,
        role: UserRole.STUDENT
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
            role: newUser.role
        },
        token
    };
};


// Login an existing user
const loginUser = async (email: string, password: string) => {

    // Find user by email
    const user = await User.findOne({
        email: email.trim().toLowerCase()
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check account status
    if (!user.isActive) {
        throw new Error("Your account is inactive");
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

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
            role: user.role
        },
        token
    };
};


export { registerUser, loginUser };