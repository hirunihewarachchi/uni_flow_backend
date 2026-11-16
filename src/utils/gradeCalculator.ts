/**
 * Calculate grade and pass/fail status based on marks
 */
export const calculateGrade = (
    marks: number
): { grade: string; status: "Passed" | "Failed" } => {
    if (marks >= 85) {
        return { grade: "A+", status: "Passed" };
    }
    if (marks >= 75) {
        return { grade: "A", status: "Passed" };
    }
    if (marks >= 70) {
        return { grade: "B+", status: "Passed" };
    }
    if (marks >= 65) {
        return { grade: "B", status: "Passed" };
    }
    if (marks >= 55) {
        return { grade: "C", status: "Passed" };
    }
    if (marks >= 40) {
        return { grade: "S", status: "Passed" };
    }
    return { grade: "F", status: "Failed" };
};
