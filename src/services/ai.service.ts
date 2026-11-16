import ExaminationResult from "../models/result.model";
import Student from "../models/student.model";
import SkillGap, { ISkillGap } from "../models/skillGap.model";
import CareerRoadmap, { ICareerRoadmap, ICareerOption } from "../models/careerRoadmap.model";

// Curated assignment library for modules
const moduleAssignmentLibrary: Record<string, { title: string; description: string; difficulty: "Beginner" | "Intermediate" | "Advanced"; duration: string }[]> = {
    PRF: [
        {
            title: "Programming Fundamentals Practice",
            description: "Solve fundamental programming exercises focusing on variables, control flow, loops, and algorithms.",
            difficulty: "Beginner",
            duration: "45 minutes"
        },
        {
            title: "Array and Method Exercises",
            description: "Implement core algorithm routines using single and multidimensional arrays and reusable methods.",
            difficulty: "Intermediate",
            duration: "60 minutes"
        }
    ],
    OOP: [
        {
            title: "OOP Concepts Assignment",
            description: "Design a clean Java application demonstrating classes, objects, constructors, encapsulation, and access modifiers.",
            difficulty: "Beginner",
            duration: "60 minutes"
        },
        {
            title: "Inheritance and Polymorphism",
            description: "Build an extensible domain model utilizing class inheritance, abstract classes, interfaces, and dynamic method dispatch.",
            difficulty: "Intermediate",
            duration: "90 minutes"
        }
    ],
    DBMS: [
        {
            title: "SQL Fundamentals",
            description: "Practise essential DDL and DML operations: SELECT, INSERT, UPDATE, DELETE with filtering and sorting.",
            difficulty: "Beginner",
            duration: "45 minutes"
        },
        {
            title: "Database Relationships & Keys",
            description: "Design normalized database tables with primary keys, composite keys, and foreign key relationships.",
            difficulty: "Intermediate",
            duration: "60 minutes"
        },
        {
            title: "JOIN & Aggregate Analytics",
            description: "Solve complex reporting queries utilizing INNER JOIN, LEFT JOIN, GROUP BY, HAVING, and aggregate functions.",
            difficulty: "Advanced",
            duration: "90 minutes"
        }
    ],
    Web: [
        {
            title: "Responsive Web Layouts",
            description: "Build mobile-first responsive web pages using modern HTML5 semantic elements and CSS Flexbox/Grid.",
            difficulty: "Beginner",
            duration: "60 minutes"
        },
        {
            title: "Interactive DOM Programming",
            description: "Develop asynchronous browser applications connecting to REST APIs using fetch and event handling.",
            difficulty: "Intermediate",
            duration: "75 minutes"
        }
    ]
};

// Available career pathways
const baseCareerTemplates: ICareerOption[] = [
    {
        id: "business-analyst",
        title: "Business Analyst",
        category: "Business & Analysis",
        description: "Understand business problems, communicate with stakeholders, and translate complex organizational needs into precise software requirements.",
        skills: [
            "Business process analysis",
            "Requirement gathering & user stories",
            "SQL and database analytics",
            "UML use case and activity modeling",
            "Stakeholder communication",
            "Agile and Scrum frameworks"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Foundation",
                duration: "Weeks 1-3",
                topics: [
                    "Understand software development life cycle (SDLC)",
                    "Learn business analysis fundamentals",
                    "Study requirement types (functional vs non-functional)"
                ],
                task: "Write a comprehensive requirement specification document for an institute management system."
            },
            {
                phase: "Phase 02 - Technical Knowledge",
                duration: "Weeks 4-6",
                topics: [
                    "SQL fundamentals and database relationships",
                    "UML use case and activity diagrams",
                    "Acceptance criteria and testability"
                ],
                task: "Create use case diagrams, data flow diagrams, and SQL validation queries for a sample domain."
            },
            {
                phase: "Phase 03 - Practical Skills",
                duration: "Weeks 7-9",
                topics: [
                    "Stakeholder communication & interview techniques",
                    "Agile product backlog management",
                    "User stories and acceptance testing"
                ],
                task: "Prepare a complete business analysis portfolio document for a real-world enterprise problem."
            }
        ]
    },
    {
        id: "ai-engineer",
        title: "AI Engineer",
        category: "Artificial Intelligence",
        description: "Build intelligent software applications using machine learning, deep neural networks, computer vision, and Generative AI models.",
        skills: [
            "Python programming & NumPy/Pandas",
            "Applied mathematics and statistics",
            "Supervised and unsupervised machine learning",
            "Deep learning and computer vision",
            "Large language models (LLMs) & prompt engineering",
            "Model deployment and MLOps"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Programming & Mathematics",
                duration: "Weeks 1-4",
                topics: [
                    "Python fundamentals and Object-Oriented design",
                    "NumPy, Pandas, and data vectorization",
                    "Probability, linear algebra, and calculus foundations"
                ],
                task: "Develop a Python data processing pipeline analyzing academic performance distributions."
            },
            {
                phase: "Phase 02 - Machine Learning Foundations",
                duration: "Weeks 5-8",
                topics: [
                    "Exploratory data analysis and feature engineering",
                    "Regression, classification, and clustering algorithms",
                    "Model evaluation, cross-validation, and metrics"
                ],
                task: "Train and evaluate an ML model predicting student performance trends on sample datasets."
            },
            {
                phase: "Phase 03 - Deep Learning & Generative AI",
                duration: "Weeks 9-12",
                topics: [
                    "Neural networks and PyTorch/TensorFlow basics",
                    "Natural language processing and embeddings",
                    "LLM APIs, prompt engineering, and agent architectures"
                ],
                task: "Build an AI learning assistant that summarizes module topics and answers student inquiries."
            }
        ]
    },
    {
        id: "software-engineer",
        title: "Software Engineer",
        category: "Software Development",
        description: "Design, build, test, and deploy robust, maintainable full-stack software applications following industrial engineering standards.",
        skills: [
            "Core programming & algorithms",
            "Object-oriented design patterns",
            "Relational & NoSQL databases",
            "Full-stack React & Node.js development",
            "Unit and integration testing",
            "Version control and CI/CD"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Programming Foundation",
                duration: "Weeks 1-3",
                topics: [
                    "Algorithmic thinking and problem solving",
                    "OOP principles and clean code conventions",
                    "Data structures: lists, maps, trees, and complexity"
                ],
                task: "Build an object-oriented Java console application with automated unit tests."
            },
            {
                phase: "Phase 02 - Full Stack Development",
                duration: "Weeks 4-8",
                topics: [
                    "TypeScript, React, and component lifecycle",
                    "Express.js RESTful API architecture",
                    "Database modeling with MongoDB & SQL"
                ],
                task: "Develop and integrate a complete full-stack web application with role-based authentication."
            },
            {
                phase: "Phase 03 - Engineering Practices",
                duration: "Weeks 9-12",
                topics: [
                    "Layered architecture and SOLID principles",
                    "Automated testing and code coverage",
                    "Git workflow, Docker, and cloud deployment"
                ],
                task: "Deploy a production-ready software project with end-to-end documentation."
            }
        ]
    },
    {
        id: "data-analyst",
        title: "Data Analyst",
        category: "Data & Analytics",
        description: "Transform complex operational data into actionable insights through SQL queries, statistical models, and interactive visualizations.",
        skills: [
            "Advanced SQL queries & aggregations",
            "Spreadsheets and pivot analysis",
            "Python data analysis (Pandas, Matplotlib)",
            "Data visualization & dashboard tools",
            "Statistical reporting"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Data Fundamentals",
                duration: "Weeks 1-3",
                topics: ["Data types, data hygiene, and validation", "Advanced SQL queries, CTEs, and window functions", "Pivot tables and statistical functions"],
                task: "Perform multi-table relational data extraction and create analytical summary tables."
            },
            {
                phase: "Phase 02 - Python Analytics",
                duration: "Weeks 4-7",
                topics: ["Python Pandas for data transformation", "Outlier detection and cleaning", "Descriptive and inferential statistics"],
                task: "Clean, explore, and report patterns across a historical student performance dataset."
            },
            {
                phase: "Phase 03 - Dashboards & Visualization",
                duration: "Weeks 8-10",
                topics: ["Data storytelling principles", "Interactive BI dashboards", "Executive reporting"],
                task: "Build an executive reporting dashboard communicating key academic and financial metrics."
            }
        ]
    },
    {
        id: "qa-engineer",
        title: "QA Engineer",
        category: "Software Quality",
        description: "Ensure software reliability and excellence through comprehensive test design, defect identification, API testing, and test automation.",
        skills: [
            "Software testing methodologies",
            "Test scenario & test case design",
            "REST API testing with Postman",
            "Database verification using SQL",
            "Automated UI testing"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Testing Foundations",
                duration: "Weeks 1-3",
                topics: ["Software testing lifecycle (STLC)", "Black-box and white-box test design techniques", "Defect tracking and bug reports"],
                task: "Write a comprehensive test plan and defect log for a student registration module."
            },
            {
                phase: "Phase 02 - API & Database Verification",
                duration: "Weeks 4-7",
                topics: ["REST API validation and assertions", "Postman test scripts and collections", "Backend state validation using SQL/MongoDB"],
                task: "Create an automated Postman test suite covering positive and negative authentication flows."
            },
            {
                phase: "Phase 03 - Automation Testing",
                duration: "Weeks 8-10",
                topics: ["UI test automation concepts", "Regression testing suites", "Continuous integration test execution"],
                task: "Implement automated browser smoke tests for critical user journeys."
            }
        ]
    }
];

// Helper to call external Google Gemini API if GEMINI_API_KEY is configured
const callGeminiAI = async (prompt: string): Promise<string | null> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
        return null;
    }
};

/**
 * 1. AI Skill Gap Analysis
 * Retrieves the student's published academic records, evaluates strengths & weaknesses,
 * calls external AI if available, and structures learning milestones & assignments.
 */
export const analyzeStudentSkillGap = async (studentId: string) => {
    const student = await Student.findOne({
        $or: [{ studentId }, { registrationNumber: studentId }]
    });

    if (!student) {
        throw new Error("Student record not found");
    }

    // Retrieve published results
    const results = await ExaminationResult.find({
        studentId: student.studentId || student.registrationNumber,
        isPublished: true
    });

    if (results.length === 0) {
        return {
            hasSufficientData: false,
            message: "Insufficient examination results available to perform an AI Skill Gap Analysis. Results will appear once officially published by the Exam Department.",
            student: {
                id: student.studentId || student.registrationNumber,
                name: `${student.firstName} ${student.lastName}`,
                batch: student.batchNumber
            }
        };
    }

    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const averageMarks = Math.round(totalMarks / results.length);
    const strongModules = results.filter(r => r.marks >= 75);
    const weakModules = results.filter(r => r.marks < 75).sort((a, b) => a.marks - b.marks);

    // Build module gaps
    const moduleGaps = results.map(r => {
        const code = r.moduleCode || r.subject.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase();
        const level = r.marks >= 75 ? "Strong" : r.marks >= 50 ? "Moderate" : "Needs Improvement";
        const priority = r.marks < 50 ? "High Priority" : r.marks < 75 ? "Improvement Needed" : "Satisfactory";

        let defaultFocus = "Review fundamental concepts, practical assignments, and problem-solving exercises.";
        if (code === "DBMS") defaultFocus = "Strengthen SQL queries, database design, keys, relationships and JOIN operations.";
        if (code === "OOP") defaultFocus = "Revise classes, objects, constructors, encapsulation, inheritance, and polymorphism.";
        if (code === "PRF") defaultFocus = "Practise programming logic, variables, conditions, loops, arrays, and methods.";

        const tasks = (moduleAssignmentLibrary[code] || moduleAssignmentLibrary["PRF"]).map((task, index) => ({
            id: `${student.studentId || student.registrationNumber}-${code}-${index}`,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            duration: task.duration,
            completed: false
        }));

        return {
            module: r.moduleCode || r.subject,
            mark: r.marks,
            level: level as any,
            priority: priority as any,
            recommendedFocus: defaultFocus,
            assignments: tasks
        };
    });

    // Default synthesis
    let analysisSummary = `${student.firstName}, based on your ${results.length} published examination records, your overall average is ${averageMarks}%. `;
    if (weakModules.length > 0) {
        analysisSummary += `Your results indicate that ${weakModules.map(m => m.moduleCode || m.subject).join(", ")} requires additional attention. ${weakModules[0].moduleCode || weakModules[0].subject} is your highest priority improvement area (${weakModules[0].marks}%). Follow the personalized learning roadmap below to strengthen your understanding.`;
    } else {
        analysisSummary += `Outstanding performance! All your published module results meet or exceed the target threshold of 75%. Continue your revision and practical projects to maintain your technical proficiency.`;
    }

    // Try calling external Gemini AI for enhanced synthesis
    const aiPrompt = `Act as an academic mentor at IJSE. Analyze student ${student.firstName}'s results: Average: ${averageMarks}%. Weak modules: ${weakModules.map(m => `${m.subject}: ${m.marks}%`).join(", ")}. Strong modules: ${strongModules.map(m => `${m.subject}: ${m.marks}%`).join(", ")}. Provide a concise 2-sentence empathetic recommendation.`;
    const aiEnhanced = await callGeminiAI(aiPrompt);
    if (aiEnhanced) {
        analysisSummary = aiEnhanced;
    }

    // Save or update analysis record
    const record = await SkillGap.findOneAndUpdate(
        { studentId: student.studentId || student.registrationNumber },
        {
            studentId: student.studentId || student.registrationNumber,
            studentName: `${student.firstName} ${student.lastName}`,
            batchNumber: student.batchNumber || "HDSE-75",
            averageMarks,
            strongCount: strongModules.length,
            weakCount: weakModules.length,
            analysisSummary,
            modules: moduleGaps,
            generatedByAI: true,
            analyzedAt: new Date()
        },
        { upsert: true, returnDocument: 'after' }
    );

    return {
        hasSufficientData: true,
        record
    };
};

/**
 * Toggle assignment completion in skill gap
 */
export const toggleAssignmentProgress = async (studentId: string, assignmentId: string) => {
    const record = await SkillGap.findOne({ studentId });
    if (!record) {
        throw new Error("Skill gap record not found");
    }

    if (record.completedAssignmentIds.includes(assignmentId)) {
        record.completedAssignmentIds = record.completedAssignmentIds.filter(id => id !== assignmentId);
    } else {
        record.completedAssignmentIds.push(assignmentId);
    }

    await record.save();
    return record;
};

/**
 * 2. AI Career Roadmap
 * Matches real academic marks to career domains and generates/retrieves career roadmaps.
 */
export const getStudentCareerRoadmap = async (studentId: string) => {
    const student = await Student.findOne({
        $or: [{ studentId }, { registrationNumber: studentId }]
    });

    if (!student) {
        throw new Error("Student record not found");
    }

    // Retrieve published results
    const results = await ExaminationResult.find({
        studentId: student.studentId || student.registrationNumber,
        isPublished: true
    });

    const marksMap: Record<string, number> = {};
    for (const r of results) {
        const key = (r.moduleCode || r.subject).toUpperCase();
        if (key.includes("PRF")) marksMap.PRF = r.marks;
        if (key.includes("OOP")) marksMap.OOP = r.marks;
        if (key.includes("DBMS")) marksMap.DBMS = r.marks;
        if (key.includes("WEB")) marksMap.WEB = r.marks;
        if (key.includes("SE") || key.includes("SOFTWARE")) marksMap.SE = r.marks;
    }

    // Calculate match scores
    const calculatedCareers = baseCareerTemplates.map(c => {
        let score = 50;
        if (c.id === "business-analyst") {
            score = Math.round(((marksMap.SE || 50) + (marksMap.DBMS || 50) + (marksMap.OOP || 50)) / 3);
        } else if (c.id === "ai-engineer") {
            score = Math.round(((marksMap.PRF || 50) + (marksMap.DBMS || 50) + (marksMap.OOP || 50)) / 3);
        } else if (c.id === "software-engineer") {
            score = Math.round(((marksMap.PRF || 50) + (marksMap.OOP || 50) + (marksMap.WEB || 50)) / 3);
        } else if (c.id === "data-analyst") {
            score = Math.round(((marksMap.DBMS || 50) + (marksMap.PRF || 50)) / 2);
        } else if (c.id === "qa-engineer") {
            score = Math.round(((marksMap.SE || 50) + (marksMap.WEB || 50) + (marksMap.DBMS || 50)) / 3);
        }

        return {
            ...c,
            matchScore: score
        };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Check if user already confirmed or selected a career
    let existingRecord = await CareerRoadmap.findOne({
        studentId: student.studentId || student.registrationNumber
    });

    if (!existingRecord) {
        existingRecord = await CareerRoadmap.create({
            studentId: student.studentId || student.registrationNumber,
            studentName: `${student.firstName} ${student.lastName}`,
            batchNumber: student.batchNumber || "HDSE-75",
            selectedCareerId: calculatedCareers[0].id,
            selectedCareerTitle: calculatedCareers[0].title,
            careerConfirmed: false,
            recommendedCareers: calculatedCareers,
            generatedByAI: true
        });
    } else {
        existingRecord.recommendedCareers = calculatedCareers;
        await existingRecord.save();
    }

    return {
        student: {
            id: student.studentId || student.registrationNumber,
            name: `${student.firstName} ${student.lastName}`,
            batch: student.batchNumber
        },
        results: results.map(r => ({ module: r.moduleCode || r.subject, mark: r.marks })),
        roadmap: existingRecord
    };
};

/**
 * Confirm student career goal
 */
export const confirmCareerGoal = async (studentId: string, careerId: string) => {
    const record = await CareerRoadmap.findOne({ studentId });
    if (!record) {
        throw new Error("Career roadmap record not found");
    }

    const selected = record.recommendedCareers.find(c => c.id === careerId) || baseCareerTemplates.find(c => c.id === careerId);

    record.selectedCareerId = careerId;
    if (selected) {
        record.selectedCareerTitle = selected.title;
    }
    record.careerConfirmed = true;
    await record.save();

    return record;
};
