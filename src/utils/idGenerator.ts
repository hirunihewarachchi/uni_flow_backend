import Student from "../models/student.model";
import User from "../models/user.model";

/**
 * Normalizes a batch name and course code to produce the ID prefix.
 * Example: course "HDSE", batch "HDSE 75" or "HDSE-75" -> "HDSE75"
 * Example: course "CMJD", batch "CMJD-01" -> "CMJD01"
 * Example: course "CAME", batch "CAME-01" -> "CAME01"
 */
export const generateIdPrefix = (courseCode: string, batchNumber: string): string => {
    // Strip non-alphanumeric characters from course and batch
    const cleanCourse = courseCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const cleanBatch = batchNumber.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    // If batch already starts with course (e.g. HDSE75), use batch
    if (cleanBatch.startsWith(cleanCourse)) {
        return cleanBatch;
    }

    return `${cleanCourse}${cleanBatch}`;
};

/**
 * Generates a unique 5-digit student ID.
 * Format: HDSE75-12345
 */
export const generateStudentId = async (courseCode: string, batchNumber: string): Promise<string> => {
    const prefix = generateIdPrefix(courseCode, batchNumber);

    // Find existing student IDs with this prefix to get the highest suffix or count
    const regex = new RegExp(`^${prefix}-\\d{5}$`);
    const count = await Student.countDocuments({
        studentId: { $regex: regex }
    });

    let suffixNumber = count + 1;
    let studentId = `${prefix}-${String(suffixNumber).padStart(5, "0")}`;

    // Verify uniqueness against Student and User collections
    let exists = await Student.findOne({ studentId });
    while (exists) {
        suffixNumber += 1;
        studentId = `${prefix}-${String(suffixNumber).padStart(5, "0")}`;
        exists = await Student.findOne({ studentId });
    }

    return studentId;
};

/**
 * Generates a unique institutional login identifier.
 * Format: name+batch@ijse.com (without comma or dot, e.g. hirunihdse75@ijse.com)
 */
export const generateInstitutionalEmail = async (
    firstName: string,
    batchNumber: string
): Promise<string> => {
    const cleanName = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanBatch = batchNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    let baseIdentifier = `${cleanName}${cleanBatch}@ijse.com`;

    // Check for collision
    let count = 0;
    let candidate = baseIdentifier;

    let userExists = await User.findOne({
        $or: [{ email: candidate }, { institutionalId: candidate }]
    });

    while (userExists) {
        count += 1;
        candidate = `${cleanName}${cleanBatch}${count}@ijse.com`;
        userExists = await User.findOne({
            $or: [{ email: candidate }, { institutionalId: candidate }]
        });
    }

    return candidate;
};
