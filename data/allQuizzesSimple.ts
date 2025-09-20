import { IQuiz, IQuestion } from "@/types/types";
import { eventQuizzes } from "./eventQuizzes";

// Create some sample additional quizzes without requiring external files
const createSampleQuizzes = (): IQuiz[] => {
    return [
        {
            id: "cs-basics",
            title: "Computer Science Fundamentals",
            description: "Test your knowledge of basic computer science concepts including hardware, software, and programming principles.",
            image: "/categories/image--computer-science.svg",
            categoryId: "computer-science",
            questions: [
                {
                    id: "cs-q1",
                    text: "What does CPU stand for?",
                    difficulty: "easy",
                    options: [
                        { id: "cs-q1-opt1", text: "Central Processing Unit", isCorrect: true },
                        { id: "cs-q1-opt2", text: "Central Programming Unit", isCorrect: false },
                        { id: "cs-q1-opt3", text: "Central Process Unit", isCorrect: false },
                        { id: "cs-q1-opt4", text: "Computer Processing Unit", isCorrect: false },
                    ]
                },
                {
                    id: "cs-q2",
                    text: "Which of the following is not a programming language?",
                    difficulty: "easy",
                    options: [
                        { id: "cs-q2-opt1", text: "Python", isCorrect: false },
                        { id: "cs-q2-opt2", text: "Java", isCorrect: false },
                        { id: "cs-q2-opt3", text: "HTML", isCorrect: true },
                        { id: "cs-q2-opt4", text: "C++", isCorrect: false },
                    ]
                },
                {
                    id: "cs-q3",
                    text: "What is the binary representation of decimal 8?",
                    difficulty: "medium",
                    options: [
                        { id: "cs-q3-opt1", text: "1000", isCorrect: true },
                        { id: "cs-q3-opt2", text: "1001", isCorrect: false },
                        { id: "cs-q3-opt3", text: "1010", isCorrect: false },
                        { id: "cs-q3-opt4", text: "1100", isCorrect: false },
                    ]
                }
            ],
            isEvent: false,
            difficulty: "Beginner to Intermediate"
        },
        {
            id: "data-structures",
            title: "Data Structures & Algorithms",
            description: "Challenge yourself with questions about data structures, algorithms, and computational complexity.",
            image: "/categories/image--data-structures.svg",
            categoryId: "data-structures",
            questions: [
                {
                    id: "ds-q1",
                    text: "What is the time complexity of searching in a balanced binary search tree?",
                    difficulty: "medium",
                    options: [
                        { id: "ds-q1-opt1", text: "O(1)", isCorrect: false },
                        { id: "ds-q1-opt2", text: "O(log n)", isCorrect: true },
                        { id: "ds-q1-opt3", text: "O(n)", isCorrect: false },
                        { id: "ds-q1-opt4", text: "O(n²)", isCorrect: false },
                    ]
                },
                {
                    id: "ds-q2",
                    text: "Which data structure uses LIFO (Last In First Out) principle?",
                    difficulty: "easy",
                    options: [
                        { id: "ds-q2-opt1", text: "Queue", isCorrect: false },
                        { id: "ds-q2-opt2", text: "Stack", isCorrect: true },
                        { id: "ds-q2-opt3", text: "Array", isCorrect: false },
                        { id: "ds-q2-opt4", text: "Linked List", isCorrect: false },
                    ]
                }
            ],
            isEvent: false,
            difficulty: "Intermediate"
        },
        {
            id: "general-knowledge",
            title: "General Knowledge Quiz",
            description: "Test your general knowledge with questions from various topics.",
            image: "/categories/image--science.svg",
            categoryId: "general",
            questions: [
                {
                    id: "gk-q1",
                    text: "What is the capital of Australia?",
                    difficulty: "easy",
                    options: [
                        { id: "gk-q1-opt1", text: "Sydney", isCorrect: false },
                        { id: "gk-q1-opt2", text: "Melbourne", isCorrect: false },
                        { id: "gk-q1-opt3", text: "Canberra", isCorrect: true },
                        { id: "gk-q1-opt4", text: "Perth", isCorrect: false },
                    ]
                },
                {
                    id: "gk-q2",
                    text: "Who painted the Mona Lisa?",
                    difficulty: "easy",
                    options: [
                        { id: "gk-q2-opt1", text: "Pablo Picasso", isCorrect: false },
                        { id: "gk-q2-opt2", text: "Leonardo da Vinci", isCorrect: true },
                        { id: "gk-q2-opt3", text: "Vincent van Gogh", isCorrect: false },
                        { id: "gk-q2-opt4", text: "Michelangelo", isCorrect: false },
                    ]
                },
                {
                    id: "gk-q3",
                    text: "What is the largest planet in our solar system?",
                    difficulty: "easy",
                    options: [
                        { id: "gk-q3-opt1", text: "Earth", isCorrect: false },
                        { id: "gk-q3-opt2", text: "Saturn", isCorrect: false },
                        { id: "gk-q3-opt3", text: "Jupiter", isCorrect: true },
                        { id: "gk-q3-opt4", text: "Neptune", isCorrect: false },
                    ]
                }
            ],
            isEvent: false,
            difficulty: "Easy"
        }
    ];
};

// Export all available quizzes
export const allAvailableQuizzes: IQuiz[] = [
    ...eventQuizzes,
    ...createSampleQuizzes()
].filter(quiz => quiz && quiz.questions && quiz.questions.length > 0);

// Also export individual collections for convenience
export { eventQuizzes };
export const additionalQuizzes = createSampleQuizzes();