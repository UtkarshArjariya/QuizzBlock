import { IQuiz, IQuestion } from "@/types/types";
import { eventQuizzes } from "./eventQuizzes";

// Safe import with error handling
const safeRequire = (path: string) => {
    try {
        return require(path);
    } catch (error) {
        console.error(`Failed to import ${path}:`, error);
        return [];
    }
};

// Import question sets - these are CommonJS modules
const csQuestions = safeRequire("./csQuestions.js");
const dsQuestions = safeRequire("./dsQuestions.js");
const biologyQuestions = safeRequire("./biologyQuestions.js");
const chemistryQuestions = safeRequire("./chemistryQuestions.js");
const physicsQuestions = safeRequire("./physicsQuestions.js");
const programmingQuestions = safeRequire("./programmingQuestions.js");

// Helper function to convert question format and add IDs
const convertQuestions = (questions: any[], prefix: string): IQuestion[] => {
    if (!Array.isArray(questions)) {
        console.warn(`Questions for ${prefix} is not an array:`, questions);
        return [];
    }

    return questions.map((q: any, index: number) => ({
        id: `${prefix}-q${index + 1}`,
        text: q.text || `Question ${index + 1}`,
        difficulty: q.difficulty || "medium",
        options: Array.isArray(q.options) ? q.options.map((opt: any, optIndex: number) => ({
            id: `${prefix}-q${index + 1}-opt${optIndex + 1}`,
            text: opt.text || `Option ${optIndex + 1}`,
            isCorrect: Boolean(opt.isCorrect)
        })) : []
    }));
};

// Create quizzes from question sets
const createAdditionalQuizzes = (): IQuiz[] => {
    const quizzes: IQuiz[] = [];

    try {
        if (csQuestions.length > 0) {
            quizzes.push({
                id: "cs-basics",
                title: "Computer Science Fundamentals",
                description: "Test your knowledge of basic computer science concepts including hardware, software, and programming principles.",
                image: "/categories/image--computer-science.svg",
                categoryId: "computer-science",
                questions: convertQuestions(csQuestions, "cs"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            });
        }

        if (dsQuestions.length > 0) {
            quizzes.push({
                id: "data-structures",
                title: "Data Structures & Algorithms",
                description: "Challenge yourself with questions about data structures, algorithms, and computational complexity.",
                image: "/categories/image--data-structures.svg",
                categoryId: "data-structures",
                questions: convertQuestions(dsQuestions, "ds"),
                isEvent: false,
                difficulty: "Intermediate"
            });
        }

        if (biologyQuestions.length > 0) {
            quizzes.push({
                id: "biology-basics",
                title: "Biology Fundamentals",
                description: "Explore the fascinating world of biology with questions about cells, genetics, and ecosystems.",
                image: "/categories/image--biology.svg",
                categoryId: "biology",
                questions: convertQuestions(biologyQuestions, "bio"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            });
        }

        if (chemistryQuestions.length > 0) {
            quizzes.push({
                id: "chemistry-basics",
                title: "Chemistry Fundamentals",
                description: "Test your understanding of chemical elements, reactions, and molecular structures.",
                image: "/categories/image--chemistry.svg",
                categoryId: "chemistry",
                questions: convertQuestions(chemistryQuestions, "chem"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            });
        }

        if (physicsQuestions.length > 0) {
            quizzes.push({
                id: "physics-basics",
                title: "Physics Fundamentals",
                description: "Dive into the principles of physics including mechanics, thermodynamics, and electromagnetism.",
                image: "/categories/image--physics.svg",
                categoryId: "physics",
                questions: convertQuestions(physicsQuestions, "phys"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            });
        }

        if (programmingQuestions.length > 0) {
            quizzes.push({
                id: "programming-basics",
                title: "Programming Fundamentals",
                description: "Master the basics of programming including syntax, logic, and problem-solving techniques.",
                image: "/categories/image--programming.svg",
                categoryId: "programming",
                questions: convertQuestions(programmingQuestions, "prog"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            });
        }
    } catch (error) {
        console.error("Error creating additional quizzes:", error);
    }

    return quizzes;
};

// Combine all quizzes
const allAdditionalQuizzes = createAdditionalQuizzes();

// Export all available quizzes
export const allAvailableQuizzes: IQuiz[] = [
    ...eventQuizzes,
    ...allAdditionalQuizzes
].filter(quiz => quiz && quiz.questions && quiz.questions.length > 0);

// Also export individual collections for convenience
export { eventQuizzes };
export const additionalQuizzes = allAdditionalQuizzes;