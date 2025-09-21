import mongoose, { Schema, Document } from 'mongoose';
import { connectMongoose, DB_NAMES } from '../mongodb';

export interface IQuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface IQuestion extends Document {
    questionId: string;
    text: string;
    options: IQuestionOption[];
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit: number;
    explanation?: string;
    tags: string[];
    isActive: boolean;
    usageCount: number;
    correctAnswerRate: number;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionOptionSchema: Schema = new Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema: Schema = new Schema({
    questionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    },
    options: {
        type: [QuestionOptionSchema],
        required: true,
        validate: [
            {
                validator: function (options: IQuestionOption[]) {
                    return options.length >= 2 && options.length <= 6;
                },
                message: 'Question must have between 2 and 6 options'
            },
            {
                validator: function (options: IQuestionOption[]) {
                    return options.filter(opt => opt.isCorrect).length >= 1;
                },
                message: 'Question must have at least one correct answer'
            }
        ]
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
        index: true
    },
    points: {
        type: Number,
        default: 100,
        min: 10,
        max: 1000
    },
    timeLimit: {
        type: Number,
        default: 30,
        min: 5,
        max: 300
    },
    explanation: {
        type: String,
        trim: true,
        maxLength: 2000
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    usageCount: {
        type: Number,
        default: 0,
        min: 0
    },
    correctAnswerRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    createdBy: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better performance
QuestionSchema.index({ questionId: 1 });
QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ isActive: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ usageCount: -1 });
QuestionSchema.index({ correctAnswerRate: 1 });
QuestionSchema.index({ createdAt: -1 });

let QuestionModel: mongoose.Model<IQuestion>;

export const getQuestionModel = async (): Promise<mongoose.Model<IQuestion>> => {
    if (QuestionModel) {
        return QuestionModel;
    }

    const connection = await connectMongoose(DB_NAMES.QUESTIONS);
    QuestionModel = connection.model<IQuestion>('Question', QuestionSchema);
    return QuestionModel;
};