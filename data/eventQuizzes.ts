import { IQuiz } from "@/types/types";

export const eventQuizzes: IQuiz[] = [
  {
    id: "event-1",
    title: "Mission Space: ISRO Special (मिशन स्पेस : इसरो स्पेशल)",
    description: "India's sky is not the limit—it's the beginning. From Aryabhata to Chandrayaan, ISRO has taken India to the stars. 🚀🛰️🟦 The Mission Space Quiz celebrates India's space journey—rockets, missions, and the genius behind them. 🌍✨",
    image: "/categories/image--science.svg",
    categoryId: "science",
    isEvent: true,
    prize: 2500,
    date: "Sep 24, 2025",
    time: "8:00 PM",
    duration: "7m 30s",
    difficulty: "Beginner Brainiac",
    totalSlots: 350,
    slotsLeft: 180,
    registrationFee: 10,
    creator: "Krayonnz",
    followers: "0.11M",
    tags: ["Space", "ISRO", "Science", "India"],
    questions: [
      {
        id: "q1",
        text: "Which was India's first satellite?",
        difficulty: "easy",
        options: [
          { id: "a1", text: "Aryabhata", isCorrect: true },
          { id: "a2", text: "Bhaskara", isCorrect: false },
          { id: "a3", text: "Rohini", isCorrect: false },
          { id: "a4", text: "INSAT", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "In which year was ISRO established?",
        difficulty: "medium",
        options: [
          { id: "b1", text: "1969", isCorrect: true },
          { id: "b2", text: "1972", isCorrect: false },
          { id: "b3", text: "1965", isCorrect: false },
          { id: "b4", text: "1975", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "Which rocket is known as India's 'workhorse'?",
        difficulty: "medium",
        options: [
          { id: "c1", text: "PSLV", isCorrect: true },
          { id: "c2", text: "GSLV", isCorrect: false },
          { id: "c3", text: "ASLV", isCorrect: false },
          { id: "c4", text: "SSLV", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "event-2",
    title: "AI Revolution: Machine Learning Mastery",
    description: "Dive deep into the world of artificial intelligence and machine learning. From neural networks to deep learning algorithms, test your knowledge of the technologies shaping our future. 🤖🧠⚡ Explore the fascinating realm where data meets intelligence! 📊💡",
    image: "/categories/image--computer-science.svg",
    categoryId: "technology",
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
    title: "Climate Champions: Environmental Science Challenge",
    description: "Join the fight against climate change! Test your knowledge of environmental science, sustainability, and green technologies. 🌱🌍💚 From renewable energy to conservation efforts, discover how science is helping us protect our planet. 🌊🌿",
    image: "/categories/image--science.svg",
    categoryId: "environment",
    isEvent: true,
    prize: 1800,
    date: "Sep 30, 2025",
    time: "6:00 PM",
    duration: "8m 45s",
    difficulty: "Eco Warrior",
    totalSlots: 150,
    slotsLeft: 45,
    registrationFee: 8,
    creator: "Green Minds",
    followers: "0.08M",
    tags: ["Environment", "Climate", "Sustainability", "Green Tech"],
    questions: [
      {
        id: "q6",
        text: "What is the main cause of global warming?",
        difficulty: "easy",
        options: [
          { id: "f1", text: "Greenhouse gas emissions", isCorrect: true },
          { id: "f2", text: "Solar radiation", isCorrect: false },
          { id: "f3", text: "Ocean currents", isCorrect: false },
          { id: "f4", text: "Volcanic activity", isCorrect: false }
        ]
      },
      {
        id: "q7",
        text: "Which renewable energy source has the highest efficiency?",
        difficulty: "medium",
        options: [
          { id: "g1", text: "Solar panels", isCorrect: false },
          { id: "g2", text: "Wind turbines", isCorrect: false },
          { id: "g3", text: "Hydroelectric", isCorrect: true },
          { id: "g4", text: "Geothermal", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "event-4",
    title: "Crypto & Blockchain: Web3 Mastery",
    description: "Navigate the decentralized world of cryptocurrency and blockchain technology! 🪙⛓️💎 From Bitcoin to DeFi, NFTs to smart contracts, test your understanding of the technologies revolutionizing finance and beyond. 🚀💰",
    image: "/categories/image--technology.svg",
    categoryId: "crypto",
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

export function getAllEventQuizzes(): IQuiz[] {
  return eventQuizzes;
}