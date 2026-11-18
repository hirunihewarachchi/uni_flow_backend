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
    ],
    SE: [
        {
            title: "Software Requirements Specification",
            description: "Author comprehensive functional and non-functional requirements with UML use case diagrams.",
            difficulty: "Beginner",
            duration: "60 minutes"
        },
        {
            title: "Layered Architecture Implementation",
            description: "Implement a 3-tier layered architecture application strictly complying with SOLID design principles.",
            difficulty: "Intermediate",
            duration: "90 minutes"
        }
    ]
};

// High-Level Honors and Advanced assignments for students scoring >= 75%
export const honorsAssignmentLibrary: Record<string, { title: string; description: string; difficulty: "Advanced" | "Honors"; duration: string }[]> = {
    PRF: [
        {
            title: "Honors Challenge: Advanced Algorithmic Complexity & Bare-Metal Memory Pool",
            description: "Implement high-performance cache-aware data structures and an arena-based memory allocation pool simulating bare-metal JVM memory management.",
            difficulty: "Honors",
            duration: "120 minutes"
        },
        {
            title: "Competitive Problem Solving: Dynamic Programming & Bit Manipulation",
            description: "Solve hard-tier graph pathfinding, multi-state dynamic programming, and bitwise optimization challenges without third-party libraries.",
            difficulty: "Advanced",
            duration: "90 minutes"
        }
    ],
    OOP: [
        {
            title: "Honors Challenge: Custom Inversion-of-Control (IoC) & Dependency Injection Container",
            description: "Architect a custom Reflection-driven IoC container supporting @Component, @Autowired, Singleton/Prototype lifecycle scopes, and circular dependency resolution.",
            difficulty: "Honors",
            duration: "150 minutes"
        },
        {
            title: "Enterprise Architecture: Event-Driven CQRS & Domain-Driven Design (DDD)",
            description: "Implement an enterprise banking aggregate root with immutable domain event streams, command handlers, and write-model decoupling.",
            difficulty: "Advanced",
            duration: "120 minutes"
        }
    ],
    DBMS: [
        {
            title: "Honors Challenge: Storage Engine Internals & B+ Tree Indexing",
            description: "Implement an in-memory B+ Tree index with Write-Ahead Logging (WAL), page buffer manager, and ACID crash-recovery simulation.",
            difficulty: "Honors",
            duration: "180 minutes"
        },
        {
            title: "Enterprise Challenge: Distributed Sharding & EXPLAIN Query Tuning",
            description: "Design a horizontally partitioned database router with read-replica replication, deadlock detection, and sub-millisecond query plan optimization.",
            difficulty: "Advanced",
            duration: "120 minutes"
        }
    ],
    WEB: [
        {
            title: "Honors Challenge: Reactive Virtual DOM & Reconciler from Scratch",
            description: "Construct a lightweight reactive UI framework featuring a custom Virtual DOM tree diffing reconciler, batching scheduler, and reactive hooks.",
            difficulty: "Honors",
            duration: "150 minutes"
        },
        {
            title: "Production Challenge: Real-Time CRDT Collaborative Multi-User Canvas",
            description: "Build a distributed collaborative editor using Conflict-Free Replicated Data Types (CRDTs), WebSockets, and WebRTC fallback channels.",
            difficulty: "Advanced",
            duration: "120 minutes"
        }
    ],
    SE: [
        {
            title: "Honors Challenge: Chaos Engineering & Distributed Resilience Blueprint",
            description: "Author a mission-critical distributed systems architecture blueprint and execute automated Chaos Engineering failure injection scenarios.",
            difficulty: "Honors",
            duration: "180 minutes"
        },
        {
            title: "Enterprise Challenge: Zero-Downtime Microservices Mesh & Istio Routing",
            description: "Deploy a resilient microservices mesh with automated canary routing, distributed OpenTelemetry tracing, and circuit breakers.",
            difficulty: "Advanced",
            duration: "120 minutes"
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
    },
    {
        id: "cloud-engineer",
        title: "Cloud & DevOps Engineer",
        category: "Cloud & Infrastructure",
        description: "Architect resilient cloud infrastructure, automate deployment pipelines (CI/CD), and monitor distributed containerized services.",
        skills: [
            "Linux systems and bash scripting",
            "Docker and Kubernetes container orchestration",
            "Cloud computing platforms (AWS / Azure)",
            "Infrastructure as Code (Terraform)",
            "CI/CD automation pipelines (GitHub Actions)",
            "System monitoring, Prometheus and Grafana"
        ],
        matchScore: 0,
        roadmap: [
            {
                phase: "Phase 01 - Systems & Scripting",
                duration: "Weeks 1-3",
                topics: [
                    "Linux operating system internals & networking fundamentals",
                    "Advanced Bash scripting & automation routines",
                    "Git branching workflows and repository management"
                ],
                task: "Automate server health inspection and log archival across remote virtual instances using Bash."
            },
            {
                phase: "Phase 02 - Containers & CI/CD",
                duration: "Weeks 4-8",
                topics: [
                    "Docker multi-stage builds & container security",
                    "GitHub Actions CI/CD workflows and automated releases",
                    "Kubernetes pods, services, ingress controllers, and configmaps"
                ],
                task: "Containerize a microservice application and build a continuous deployment pipeline to Kubernetes."
            },
            {
                phase: "Phase 03 - Cloud Architecture & Observability",
                duration: "Weeks 9-12",
                topics: [
                    "AWS core services (EC2, ECS, S3, RDS, VPC)",
                    "Infrastructure as Code with Terraform",
                    "Prometheus metrics scraping and Grafana dashboard alerts"
                ],
                task: "Provision an automated multi-AZ cloud architecture with live traffic monitoring and alerting."
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
    const cleanId = (studentId || "").trim();
    const idRegex = new RegExp(`^${cleanId.replace(/[- ]+/g, "[- ]?")}$`, "i");

    const student = await Student.findOne({
        $or: [
            { studentId: idRegex },
            { registrationNumber: idRegex },
            { studentId: cleanId },
            { registrationNumber: cleanId }
        ]
    });

    if (!student) {
        throw new Error("Student record not found");
    }

    // Retrieve published results using student ID variations
    const targetIds = [student.studentId, student.registrationNumber, cleanId].filter((id): id is string => Boolean(id));
    const regexList = targetIds.map(id => new RegExp(`^${id.trim().replace(/[- ]+/g, "[- ]?")}$`, "i"));

    const results = await ExaminationResult.find({
        studentId: { $in: regexList },
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

    // Build module gaps with tailored Honors assignments for >= 75%
    const moduleGaps = results.map(r => {
        const raw = (r.moduleCode || r.subject).toUpperCase();
        const code = raw.includes("PRF") ? "PRF" : raw.includes("OOP") ? "OOP" : raw.includes("DBMS") ? "DBMS" : raw.includes("WEB") ? "WEB" : "SE";
        const isHonors = r.marks >= 75;
        const level = isHonors ? "Strong" : r.marks >= 50 ? "Moderate" : "Needs Improvement";
        const priority = isHonors ? "Satisfactory" : r.marks < 50 ? "High Priority" : "Improvement Needed";

        let defaultFocus = isHonors
            ? "Advanced Honors Track: Undertake enterprise architecture challenges, custom framework implementations, and production-grade system designs."
            : "Review fundamental concepts, practical assignments, and problem-solving exercises.";

        if (!isHonors) {
            if (code === "DBMS") defaultFocus = "Strengthen SQL queries, database design, keys, relationships and JOIN operations.";
            if (code === "OOP") defaultFocus = "Revise classes, objects, constructors, encapsulation, inheritance, and polymorphism.";
            if (code === "PRF") defaultFocus = "Practise programming logic, variables, conditions, loops, arrays, and methods.";
            if (code === "WEB") defaultFocus = "Practise modern responsive UI design, asynchronous fetch patterns, and REST integration.";
            if (code === "SE") defaultFocus = "Review SDLC phases, requirement specifications, UML design, and layered architecture.";
        }

        const assignmentSource = isHonors
            ? (honorsAssignmentLibrary[code] || honorsAssignmentLibrary["PRF"])
            : (moduleAssignmentLibrary[code] || moduleAssignmentLibrary["PRF"]);

        const tasks = assignmentSource.map((task, index) => ({
            id: `${student.studentId || student.registrationNumber}-${code}-${isHonors ? "honors" : "remedial"}-${index}`,
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
    if (strongModules.length > 0 && weakModules.length > 0) {
        analysisSummary += `You have demonstrated honors-level mastery in ${strongModules.map(m => m.moduleCode || m.subject).join(", ")} (≥75%)! We have unlocked High-Level Honors & Architecture Challenges for these subjects to elevate you to senior developer standards. For ${weakModules.map(m => m.moduleCode || m.subject).join(", ")}, follow the targeted practice roadmaps to reinforce foundational mastery.`;
    } else if (strongModules.length > 0) {
        analysisSummary += `Outstanding excellence! You have achieved honors-level scores (≥75%) across all evaluated modules. You have been placed on the Advanced Honors & Enterprise Track with high-level system design challenges, custom framework implementations, and research-level assignments.`;
    } else {
        analysisSummary += `Your results show areas for rapid improvement. Follow the structured step-by-step assignments below, prioritizing ${weakModules[0].moduleCode || weakModules[0].subject} (${weakModules[0].marks}%), to build confidence and exam readiness.`;
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
    const cleanId = (studentId || "").trim();
    const idRegex = new RegExp(`^${cleanId.replace(/[- ]+/g, "[- ]?")}$`, "i");

    const student = await Student.findOne({
        $or: [
            { studentId: idRegex },
            { registrationNumber: idRegex },
            { studentId: cleanId },
            { registrationNumber: cleanId }
        ]
    });

    if (!student) {
        throw new Error("Student record not found");
    }

    // Retrieve published results using student ID variations
    const targetIds = [student.studentId, student.registrationNumber, cleanId].filter((id): id is string => Boolean(id));
    const regexList = targetIds.map(id => new RegExp(`^${id.trim().replace(/[- ]+/g, "[- ]?")}$`, "i"));

    const results = await ExaminationResult.find({
        studentId: { $in: regexList },
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

    // Calculate accurate weighted match scores
    const calculatedCareers = baseCareerTemplates.map(c => {
        let score = 50;
        const prf = marksMap.PRF ?? 50;
        const oop = marksMap.OOP ?? 50;
        const dbms = marksMap.DBMS ?? 50;
        const web = marksMap.WEB ?? 50;
        const se = marksMap.SE ?? 50;

        if (c.id === "software-engineer") {
            // Software Engineer: OOP 35%, WEB 30%, PRF 20%, DBMS 15%
            score = Math.round((oop * 0.35) + (web * 0.30) + (prf * 0.20) + (dbms * 0.15));
        } else if (c.id === "ai-engineer") {
            // AI Engineer: PRF 40%, DBMS 25%, OOP 20%, SE 15%
            score = Math.round((prf * 0.40) + (dbms * 0.25) + (oop * 0.20) + (se * 0.15));
        } else if (c.id === "data-analyst") {
            // Data Analyst: DBMS 50%, PRF 25%, SE 25%
            score = Math.round((dbms * 0.50) + (prf * 0.25) + (se * 0.25));
        } else if (c.id === "qa-engineer") {
            // QA Engineer: SE 40%, WEB 30%, DBMS 15%, OOP 15%
            score = Math.round((se * 0.40) + (web * 0.30) + (dbms * 0.15) + (oop * 0.15));
        } else if (c.id === "business-analyst") {
            // Business Analyst: SE 45%, DBMS 30%, PRF 25%
            score = Math.round((se * 0.45) + (dbms * 0.30) + (prf * 0.25));
        } else if (c.id === "cloud-engineer") {
            // Cloud & DevOps: WEB 35%, SE 35%, DBMS 30%
            score = Math.round((web * 0.35) + (se * 0.35) + (dbms * 0.30));
        }

        return {
            ...c,
            matchScore: Math.min(99, Math.max(30, score))
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
