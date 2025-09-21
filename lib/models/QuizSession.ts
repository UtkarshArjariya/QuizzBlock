import mongoose, { Schema, Document } from 'mongoose';
import { connectMongoose, DB_NAMES } from '../mongodb';

export interface IParticipant {
    id: string;
    walletAddress: string;
    username: string;
    score: number;
    answers: {
        questionId: string;
        selectedOptionId: string;
        isCorrect: boolean;
        answeredAt: Date;
    }[];
    joinedAt: Date;
}

export interface IQuizSession extends Document {
    sessionId: string;
    code: string;
    hostWallet: string;
    title: string;
    description?: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questions: {
        id: string;
        text: string;
        options: {
            id: string;
            text: string;
            isCorrect: boolean;
        }[];
        points: number;
        timeLimit: number;
    }[];
    participants: IParticipant[];
    status: 'waiting' | 'active' | 'ended';
    currentQuestionIndex: number;
    maxParticipants: number;
    timePerQuestion: number;
    totalQuestions: number;
    prizePool?: number;
    startedAt?: Date;
    endedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}

const ParticipantSchema: Schema = new Schema({
    id: { type: String, required: true },
    walletAddress: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    score: { type: Number, default: 0, min: 0 },
    answers: [{
        questionId: { type: String, required: true },
        selectedOptionId: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now }
    }],
    joinedAt: { type: Date, default: Date.now }
});

const QuestionOptionSchema: Schema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true }
});

const QuestionSchema: Schema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    options: [QuestionOptionSchema],
    points: { type: Number, default: 100, min: 0 },
    timeLimit: { type: Number, default: 30, min: 5, max: 300 }
});

const QuizSessionSchema: Schema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 6,
        index: true
    },
    hostWallet: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        trim: true,
        maxLength: 1000
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'mixed'],
        default: 'medium',
        index: true
    },
    questions: [QuestionSchema],
    participants: [ParticipantSchema],
    status: {
        type: String,
        enum: ['waiting', 'active', 'ended'],
        default: 'waiting',
        index: true
    },
    currentQuestionIndex: {
        type: Number,
        default: -1,
        min: -1  // Allow -1 for waiting sessions
    },
    maxParticipants: {
        type: Number,
        default: 10,
        min: 1,
        max: 100
    },
    timePerQuestion: {
        type: Number,
        default: 30,
        min: 5,
        max: 300
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 1
    },
    prizePool: {
        type: Number,
        min: 0
    },
    startedAt: Date,
    endedAt: Date,
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from creation
    }
}, {
    timestamps: true
});

// Indexes for better performance (only additional indexes, not duplicating field-level indexes)
QuizSessionSchema.index({ createdAt: -1 });
QuizSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let QuizSessionModel: mongoose.Model<IQuizSession>;

export const getQuizSessionModel = async (): Promise<mongoose.Model<IQuizSession>> => {
    if (QuizSessionModel) {
        return QuizSessionModel;
    }

    const connection = await connectMongoose(DB_NAMES.SESSIONS);
    QuizSessionModel = connection.model<IQuizSession>('QuizSession', QuizSessionSchema);
    return QuizSessionModel;
};