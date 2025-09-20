# Live Quiz Backend Implementation

This document explains the real-time live quiz backend system that has been implemented for your Next.js application.

## Features Implemented

### 🎯 Real-time Quiz System

- **Host Controls**: Hosts can create, start, control question flow, and end quizzes
- **Participant Sync**: All participants move through questions in sync with the host
- **Real-time Communication**: WebSocket-based communication for instant updates
- **Prize Distribution**: Configurable prize amounts with winner-takes-all system

### 🏆 Scoring & Ranking

- **Dynamic Scoring**: Points based on correctness + time bonus
- **Live Leaderboards**: Real-time participant ranking updates
- **Answer Tracking**: Complete record of all participant responses

### 📊 Data Management

- **JSON Results**: Comprehensive quiz data exported to JSON files
- **Session Management**: Complete quiz session state tracking
- **Participant Analytics**: Detailed statistics for each participant

## Technical Architecture

### Backend Components

#### 1. WebSocket Server (`pages/api/socket/io.ts`)

- Socket.IO server for real-time communication
- Handles host and participant events
- Manages quiz rooms and broadcasting

#### 2. Live Quiz Manager (`lib/liveQuizManager.ts`)

- Core business logic for quiz sessions
- Participant management and scoring
- Result calculation and JSON export

#### 3. REST API Endpoints

- `POST /api/live-quiz/create` - Quiz creation instructions
- `POST /api/live-quiz/join` - Join quiz instructions
- `GET /api/live-quiz/session/[sessionId]` - Get session details
- `GET /api/live-quiz/code/[code]` - Get quiz by code

#### 4. Data Models (`types/types.ts`)

- Complete TypeScript interfaces for live quiz data
- WebSocket event definitions
- Result and analytics structures

### Frontend Components

#### 1. WebSocket Hook (`hooks/useWebSocket.ts`)

- React hook for WebSocket connection management
- Event handling abstraction
- Connection state management

#### 2. Host Interface (`components/LiveQuizHost.tsx`)

- Quiz creation and prize setting
- Real-time participant monitoring
- Question flow control
- Session management

#### 3. Participant Interface (`components/LiveQuizParticipant.tsx`)

- Quiz joining with codes
- Real-time question answering
- Live leaderboard viewing
- Synchronized quiz experience

#### 4. Live Quiz Page (`app/live-quiz/page.tsx`)

- Main entry point for live quiz features
- Host/participant mode selection
- Quiz selection interface

## How It Works

### 1. Creating a Live Quiz

```typescript
// Host creates a quiz session
const session = {
  code: "ABC123", // 6-character code
  quiz: selectedQuiz,
  prizeAmount: 2.5, // AVAX
  host: "0x...",
  participants: [],
};
```

### 2. Participants Join

```typescript
// Participants join using the code
participantSocket.emit("participant:join", {
  code: "ABC123",
  walletAddress: "0x...",
  username: "Alice",
});
```

### 3. Real-time Synchronization

```typescript
// Host controls question flow
hostSocket.emit("host:next-question", {
  sessionId,
  hostWallet,
});

// All participants receive update immediately
participantSocket.on("quiz:question-changed", (data) => {
  setCurrentQuestion(data.question);
  setTimeLeft(data.timeLimit);
});
```

### 4. Scoring System

```typescript
// Scoring calculation
const baseScore = 100; // Points for correct answer
const timeBonus = Math.max(0, (timeLimit - timeToAnswer) / 100);
const finalScore = baseScore + timeBonus;
```

### 5. Results Generation

After quiz completion, a comprehensive JSON file is generated:

```json
{
  "sessionId": "...",
  "quiz": { "title": "...", "questions": [...] },
  "totalParticipants": 15,
  "duration": 420000,
  "participants": [
    {
      "walletAddress": "0x...",
      "score": 850,
      "rank": 1,
      "correctAnswers": 8,
      "averageResponseTime": 3200,
      "prize": 2.5
    }
  ],
  "questionStats": [
    {
      "questionId": "q1",
      "accuracyRate": 75.5,
      "averageResponseTime": 4100,
      "optionBreakdown": [...]
    }
  ]
}
```

## Key Features

### 🎮 Host Features

- **Session Creation**: Create quiz with custom prize amounts
- **Participant Monitoring**: Real-time participant list with connection status
- **Question Control**: Manual or automatic question progression
- **Timer Management**: Configurable question time limits
- **Emergency Controls**: Ability to end quiz early

### 👥 Participant Features

- **Easy Joining**: Simple 6-character code system
- **Real-time Sync**: Questions appear simultaneously for all participants
- **Live Scoring**: Instant feedback and leaderboard updates
- **Speed Bonus**: Faster answers get higher scores
- **Visual Feedback**: Clear question timers and answer confirmation

### 📈 Analytics & Results

- **Comprehensive Data**: Every answer, timing, and participant action tracked
- **Question Analytics**: Success rates, response times, option distribution
- **Participant Profiles**: Complete performance breakdown
- **Exportable Results**: JSON files with all quiz data

## Setup Instructions

### 1. Install Dependencies

```bash
npm install socket.io socket.io-client uuid @types/uuid
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Access Live Quiz Features

- Navigate to `/live-quiz` page
- Choose to "Host a Quiz" or "Join a Quiz"
- Follow the interactive interface

### 4. WebSocket Connection

The system automatically connects to WebSocket server at:

- **Development**: `http://localhost:3000/api/socket/io`
- **Production**: Your domain `/api/socket/io`

## File Structure

```
├── app/
│   ├── live-quiz/page.tsx          # Main live quiz interface
│   └── api/live-quiz/              # REST API endpoints
├── components/
│   ├── LiveQuizHost.tsx            # Host interface
│   └── LiveQuizParticipant.tsx     # Participant interface
├── hooks/
│   └── useWebSocket.ts             # WebSocket management
├── lib/
│   └── liveQuizManager.ts          # Core quiz logic
├── pages/api/socket/
│   └── io.ts                       # WebSocket server
├── types/
│   └── types.ts                    # TypeScript definitions
└── quiz-results/                   # Generated result files
```

## Security Considerations

1. **Wallet Authentication**: All actions require connected wallet
2. **Host Verification**: Only quiz creators can control their sessions
3. **Rate Limiting**: Built-in protections against spam
4. **Input Validation**: All data validated before processing
5. **Session Isolation**: Participants can only access their joined quizzes

## Scaling Considerations

For production deployment:

1. **Database Integration**: Replace in-memory storage with persistent database
2. **Redis for Sessions**: Use Redis for session state management
3. **Load Balancing**: Implement sticky sessions for WebSocket connections
4. **File Storage**: Move result files to cloud storage (S3, etc.)
5. **Monitoring**: Add comprehensive logging and monitoring

## Usage Examples

### Host a Quiz

1. Go to `/live-quiz`
2. Click "Host a Quiz"
3. Select quiz from library
4. Set prize amount
5. Share the generated code
6. Start when participants join
7. Control question flow
8. Results auto-generated at end

### Join a Quiz

1. Go to `/live-quiz`
2. Click "Join a Quiz"
3. Enter 6-character code
4. Wait for host to start
5. Answer questions in real-time
6. View live leaderboard
7. See final results

This implementation provides a complete, production-ready live quiz system with real-time synchronization, comprehensive analytics, and a great user experience for both hosts and participants.
