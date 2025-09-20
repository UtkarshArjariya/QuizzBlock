import { IQuiz, IQuestion } from "@/types/types";
import { eventQuizzes } from "./eventQuizzes";

// Import question sets - these are CommonJS modules
const csQuestions = require("./csQuestions.js");
const dsQuestions = require("./dsQuestions.js");
const biologyQuestions = require("./biologyQuestions.js");
const chemistryQuestions = require("./chemistryQuestions.js");
const physicsQuestions = require("./physicsQuestions.js");
const programmingQuestions = require("./programmingQuestions.js");

// Helper function to convert question format and add IDs
const convertQuestions = (questions: any[], prefix: string): IQuestion[] => {
    return questions.map((q: any, index: number) => ({
        id: `${prefix}-q${index + 1}`,
        text: q.text,
        difficulty: q.difficulty || "medium",
        options: q.options.map((opt: any, optIndex: number) => ({
            id: `${prefix}-q${index + 1}-opt${optIndex + 1}`,
            text: opt.text,
            isCorrect: opt.isCorrect
        }))
    }));
};

// Create quizzes from question sets
const createAdditionalQuizzes = (): IQuiz[] => {
    try {
        return [
            {
                id: "cs-basics",
                title: "Computer Science Fundamentals",
                description: "Test your knowledge of basic computer science concepts including hardware, software, and programming principles.",
                image: "/categories/image--computer-science.svg",
                categoryId: "computer-science",
                questions: convertQuestions(csQuestions, "cs"),
                isEvent: false,
                difficulty: "Beginner to Intermediate"
            },
            {
                id: "data-structures",
                title: "Data Structures & Algorithms",
                description: "Challenge yourself with questions about data structures, algorithms, and computational complexity.",
                image: "/categories/image--data-structures.svg",
                categoryId: "data-structures",
                questions: convertQuestions(dsQuestions, "ds"),
                isEvent: false,
                difficulty: "Intermediate"
            },
            {
                id: "biology-quiz",
                title: "Biology Essentials",
                description: "Explore the fascinating world of biology, from cell structure to ecosystems and evolution.",
                image: "/categories/image--biology.svg",
                categoryId: "biology",
                questions: convertQuestions(biologyQuestions, "bio"),
                isEvent: false,
                difficulty: "Beginner"
            },
            {
                id: "chemistry-quiz",
                title: "Chemistry Concepts",
                description: "Dive into the world of atoms, molecules, chemical reactions, and the periodic table.",
                image: "/categories/image--chemistry.svg",
                categoryId: "chemistry",
                questions: convertQuestions(chemistryQuestions, "chem"),
                isEvent: false,
                difficulty: "Intermediate"
            },
            {
                id: "physics-quiz",
                title: "Physics Principles",
                description: "Test your understanding of physics concepts from mechanics to thermodynamics and beyond.",
                image: "/categories/image--physics.svg",
                categoryId: "physics",
                questions: convertQuestions(physicsQuestions, "phys"),
                isEvent: false,
                difficulty: "Intermediate"
            },
            {
                id: "programming-quiz",
                title: "Programming Fundamentals",
                description: "Challenge your programming knowledge with questions about languages, syntax, and best practices.",
                image: "/categories/image--programming.svg",
                categoryId: "programming",
                questions: convertQuestions(programmingQuestions, "prog"),
                isEvent: false,
                difficulty: "Beginner to Advanced"
            }
        ].filter(quiz => quiz.questions.length > 0); // Only include quizzes with questions
    } catch (error) {
        console.error("Error creating additional quizzes:", error);
        return [];
    }
};

// Combine event quizzes with additional quizzes
export const allAvailableQuizzes: IQuiz[] = [
    ...eventQuizzes,
    ...createAdditionalQuizzes()
];

export default allAvailableQuizzes;