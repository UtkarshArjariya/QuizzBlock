# Kwizi Quiz Application - Project Structure

## 📁 Project Overview
This is a Next.js-based quiz application with Web3 integration, featuring both regular practice quizzes and live event quizzes with prizes.

## 🗂️ File Structure & Organization

### 📂 Core Components
```
components/
├── quiz/
│   ├── EventQuizCard.tsx    # Social media-style event quiz cards
│   ├── QuizCard.tsx         # Regular quiz cards
│   └── HomeCard.tsx         # Category selection cards
├── ui/                      # Reusable UI components (buttons, cards, etc.)
└── Header.tsx               # Application header
```

### 📂 Pages & Routing
```
app/
├── page.tsx                 # Home page - category selection
├── categories/
│   └── [categoryId]/
│       └── page.tsx         # Category page - shows both event & practice quizzes
├── quiz/
│   ├── page.tsx            # Quiz taking interface
│   └── setup/
│       └── [quizId]/
│           └── page.tsx     # Quiz setup page
└── results/
    └── page.tsx            # Quiz results page
```

### 📂 Data & Types
```
data/
├── eventQuizzes.ts         # Event quiz data with helper functions
├── csQuestions.js          # Computer Science questions
├── physicsQuestions.js     # Physics questions
└── [other subject files]   # Other subject question banks

types/
└── types.ts                # TypeScript interfaces and types
```

### 📂 Context & State
```
context/
├── globalContext.js        # Global application state
├── useCategories.js        # Category management
└── Web3Context.js          # Web3 wallet integration
```

## 🎯 Key Features

### 1. **Event Quiz Cards** (`EventQuizCard.tsx`)
- Social media post-like design
- Prize information and registration fees
- Creator profiles and follower counts
- Space-themed banners with gradients
- Social engagement features (likes, comments, shares)

### 2. **Category Pages** (`categories/[categoryId]/page.tsx`)
- **Live Quiz Events Section**: Shows event quizzes with prizes
- **Practice Quizzes Section**: Shows regular learning quizzes
- Dynamic category names and descriptions
- Responsive grid layouts

### 3. **Home Page** (`page.tsx`)
- Welcome message and app introduction
- Category selection grid
- Feature highlights (Live Events, Practice, Progress)
- Web3 wallet connection handling

## 🎨 Event Quiz Categories

### Physics & Science (Category ID: "1")
- 🚀 Mission Space: ISRO Special - ₹2,500 prize
- 🌱 Climate Champions: Environmental Science - ₹1,800 prize

### Computer Science & Technology (Category ID: "2")
- 🤖 AI Revolution: Machine Learning Mastery - ₹3,500 prize
- 🪙 Crypto & Blockchain: Web3 Mastery - ₹4,200 prize

## 🔧 How to Add New Event Quizzes

1. **Add to `data/eventQuizzes.ts`**:
```typescript
{
  id: "event-X",
  title: "Your Quiz Title",
  description: "Quiz description with emojis",
  image: "/categories/image--your-subject.svg",
  categoryId: "1", // or "2", "3", etc.
  isEvent: true,
  prize: 2000,
  date: "Dec 15, 2025",
  time: "7:00 PM",
  duration: "10m",
  difficulty: "Intermediate",
  totalSlots: 200,
  slotsLeft: 150,
  registrationFee: 15,
  creator: "Your Creator Name",
  followers: "0.1M",
  tags: ["Tag1", "Tag2"],
  questions: [/* your questions */]
}
```

2. **The quiz will automatically appear** in the appropriate category page

## 🎯 User Flow

1. **Home Page**: User sees categories and selects one
2. **Category Page**: User sees both:
   - Live Quiz Events (with prizes)
   - Practice Quizzes (for learning)
3. **Quiz Taking**: Same interface for both event and practice quizzes
4. **Results**: Performance tracking and scoring

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open `http://localhost:3000`
4. Connect MetaMask wallet
5. Explore categories and take quizzes!

## 📝 Code Organization Benefits

- **Clear Separation**: Event quizzes vs practice quizzes
- **Categorized Content**: Quizzes organized by subject
- **Reusable Components**: EventQuizCard can be used anywhere
- **Helper Functions**: Easy to filter quizzes by category
- **Documentation**: Clear comments and JSDoc annotations
- **Type Safety**: Full TypeScript support

## 🔮 Future Enhancements

- Add more event quiz categories
- Implement real-time registration
- Add payment integration for event quizzes
- Create admin panel for quiz management
- Add user profiles and leaderboards
