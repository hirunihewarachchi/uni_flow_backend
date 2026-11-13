
import Student from "../models/student.model";
// Student registration data
interface StudentRegistrationData {
    registrationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
}

// Register a new student
export const registerStudent = async (
    studentData: StudentRegistrationData
) => {

    // Check whether registration number already exists
    const existingRegistration = await Student.findOne({
        registrationNumber: studentData.registrationNumber
    });

    if (existingRegistration) {
        throw new Error("Registration number already exists");
    }

    // Check whether email already exists
    const existingEmail = await Student.findOne({
        email: studentData.email
    });

    if (existingEmail) {
        throw new Error("Student email already exists");
    }

    // Create student record
    const student = await Student.create({
        ...studentData,
        email: studentData.email.toLowerCase()
    });

    return student;
};


// Get all registered students
export const getAllStudents = async () => {

    const students = await Student.find()
        .sort({ createdAt: -1 });

    return students;
};

// Get student by ID
export const getStudentById = async (studentId: string) => {

    const student = await Student.findById(studentId);

    return student;
};


 // Update student details
export const updateStudent = async (
    studentId: string,
    studentData: {
        registrationNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: string;
    }
) => {
    const student = await Student.findByIdAndUpdate(
        studentId,
        {
            ...studentData,
            email: studentData.email.toLowerCase()
        },
        {
            new: true,
            runValidators: true
        }
    );

    return student;
};


 // Delete student by ID
export const deleteStudent = async (studentId: string) => {

    const student = await Student.findByIdAndDelete(studentId);

    return student;
};

