import { IQuiz } from "@/types/types";

// Event quizzes organized by category
export const eventQuizzes: IQuiz[] = [
    {
      id: "event-1",
      title: "Blockchain Revolution: DeFi Mastery",
      description: "Dive deep into the world of decentralized finance! From smart contracts to yield farming, test your knowledge of the technologies revolutionizing finance. 🚀⛓️💰 Explore DeFi protocols, liquidity pools, and the future of money! 🌐✨",
      image: "/categories/image--technology.svg",
      categoryId: "1", // Web3 category
    isEvent: true,
    prize: 2500,
    date: "Sep 24, 2025",
    time: "8:00 PM",
    duration: "7m 30s",
    difficulty: "Beginner Brainiac",
    totalSlots: 350,
    slotsLeft: 180,
    registrationFee: 10,
      creator: "DeFi Academy",
      followers: "0.15M",
      tags: ["DeFi", "Blockchain", "Smart Contracts", "Web3"],
      questions: [
        {
          id: "q1",
          text: "What does DeFi stand for?",
          difficulty: "easy",
          options: [
            { id: "a1", text: "Decentralized Finance", isCorrect: true },
            { id: "a2", text: "Digital Finance", isCorrect: false },
            { id: "a3", text: "Distributed Finance", isCorrect: false },
            { id: "a4", text: "Decentralized Funding", isCorrect: false }
          ]
        },
        {
          id: "q2",
          text: "Which consensus mechanism does Ethereum use?",
          difficulty: "medium",
          options: [
            { id: "b1", text: "Proof of Stake", isCorrect: true },
            { id: "b2", text: "Proof of Work", isCorrect: false },
            { id: "b3", text: "Proof of Authority", isCorrect: false },
            { id: "b4", text: "Proof of History", isCorrect: false }
          ]
        },
        {
          id: "q3",
          text: "What is a smart contract?",
          difficulty: "medium",
          options: [
            { id: "c1", text: "Self-executing contract with code", isCorrect: true },
            { id: "c2", text: "AI-powered contract", isCorrect: false },
            { id: "c3", text: "Digital signature", isCorrect: false },
            { id: "c4", text: "Blockchain transaction", isCorrect: false }
          ]
        }
      ]
  },
  {
    id: "event-2",
    title: "AI Revolution: Machine Learning Mastery",
    description: "Dive deep into the world of artificial intelligence and machine learning. From neural networks to deep learning algorithms, test your knowledge of the technologies shaping our future. 🤖🧠⚡ Explore the fascinating realm where data meets intelligence! 📊💡",
    image: "/categories/image--computer-science.svg",
    categoryId: "2", // Computer Science category
    isEvent: true,
    prize: 3500,
    date: "Oct 2, 2025",
    time: "7:30 PM",
    duration: "10m",
    difficulty: "Advanced Tech",
    totalSlots: 200,
    slotsLeft: 75,
    registrationFee: 15,
    creator: "TechQuiz Pro",
    followers: "0.25M",
    tags: ["AI", "Machine Learning", "Technology", "Future"],
    questions: [
      {
        id: "q4",
        text: "What is the primary purpose of a neural network?",
        difficulty: "medium",
        options: [
          { id: "d1", text: "Pattern recognition and learning", isCorrect: true },
          { id: "d2", text: "Data storage", isCorrect: false },
          { id: "d3", text: "Network communication", isCorrect: false },
          { id: "d4", text: "File compression", isCorrect: false }
        ]
      },
      {
        id: "q5",
        text: "Which algorithm is commonly used for classification in machine learning?",
        difficulty: "easy",
        options: [
          { id: "e1", text: "Linear Regression", isCorrect: false },
          { id: "e2", text: "Random Forest", isCorrect: true },
          { id: "e3", text: "K-means", isCorrect: false },
          { id: "e4", text: "Apriori", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "event-3",
    title: "AR/VR Metaverse: Future of Interaction",
    description: "Step into the metaverse! Test your knowledge of Augmented Reality, Virtual Reality, and immersive technologies. 🥽🌐💎 From VR headsets to AR applications, discover how these technologies are reshaping digital experiences. 🚀✨",
    image: "/categories/image--technology.svg",
    categoryId: "3", // AR/VR category
    isEvent: true,
    prize: 1800,
    date: "Sep 30, 2025",
    time: "6:00 PM",
    duration: "8m 45s",
    difficulty: "Metaverse Expert",
    totalSlots: 150,
    slotsLeft: 45,
    registrationFee: 8,
    creator: "VR Studios",
    followers: "0.12M",
    tags: ["AR", "VR", "Metaverse", "Immersive Tech"],
    questions: [
      {
        id: "q6",
        text: "What does VR stand for?",
        difficulty: "easy",
        options: [
          { id: "f1", text: "Virtual Reality", isCorrect: true },
          { id: "f2", text: "Visual Reality", isCorrect: false },
          { id: "f3", text: "Valuable Reality", isCorrect: false },
          { id: "f4", text: "Vibrant Reality", isCorrect: false }
        ]
      },
      {
        id: "q7",
        text: "What technology is used in AR to overlay digital content?",
        difficulty: "medium",
        options: [
          { id: "g1", text: "Computer Vision", isCorrect: true },
          { id: "g2", text: "Blockchain", isCorrect: false },
          { id: "g3", text: "Machine Learning", isCorrect: false },
          { id: "g4", text: "Quantum Computing", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "event-4",
    title: "Crypto & Blockchain: Web3 Mastery",
    description: "Navigate the decentralized world of cryptocurrency and blockchain technology! 🪙⛓️💎 From Bitcoin to DeFi, NFTs to smart contracts, test your understanding of the technologies revolutionizing finance and beyond. 🚀💰",
    image: "/categories/image--technology.svg",
    categoryId: "2", // Computer Science/Technology category
    isEvent: true,
    prize: 4200,
    date: "Oct 8, 2025",
    time: "9:00 PM",
    duration: "12m",
    difficulty: "Crypto Expert",
    totalSlots: 300,
    slotsLeft: 120,
    registrationFee: 20,
    creator: "Blockchain Academy",
    followers: "0.35M",
    tags: ["Cryptocurrency", "Blockchain", "DeFi", "Web3"],
    questions: [
      {
        id: "q8",
        text: "What does DeFi stand for?",
        difficulty: "easy",
        options: [
          { id: "h1", text: "Decentralized Finance", isCorrect: true },
          { id: "h2", text: "Digital Finance", isCorrect: false },
          { id: "h3", text: "Distributed Finance", isCorrect: false },
          { id: "h4", text: "Decentralized Funding", isCorrect: false }
        ]
      },
      {
        id: "q9",
        text: "Which consensus mechanism does Bitcoin use?",
        difficulty: "medium",
        options: [
          { id: "i1", text: "Proof of Work", isCorrect: true },
          { id: "i2", text: "Proof of Stake", isCorrect: false },
          { id: "i3", text: "Proof of Authority", isCorrect: false },
          { id: "i4", text: "Proof of History", isCorrect: false }
        ]
      },
      {
        id: "q10",
        text: "What is the maximum supply of Bitcoin?",
        difficulty: "hard",
        options: [
          { id: "j1", text: "21 million", isCorrect: true },
          { id: "j2", text: "50 million", isCorrect: false },
          { id: "j3", text: "100 million", isCorrect: false },
          { id: "j4", text: "Unlimited", isCorrect: false }
        ]
      }
    ]
  }
];

/**
 * Helper function to get event quizzes by category ID
 * @param categoryId - The category ID to filter event quizzes
 * @returns Array of event quizzes for the specified category
 */
export const getEventQuizzesByCategory = (categoryId: string): IQuiz[] => {
  return eventQuizzes.filter(quiz => quiz.categoryId === categoryId);
};

/**
 * Get all event quizzes (for admin or overview purposes)
 * @returns Array of all event quizzes
 */
export const getAllEventQuizzes = (): IQuiz[] => {
  return eventQuizzes;
};
