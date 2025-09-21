import mongoose, { Schema, Document } from 'mongoose';
import { connectMongoose, DB_NAMES } from '../mongodb';

export interface IUser extends Document {
    walletAddress: string;
    username?: string;
    email?: string;
    totalQuizzes: number;
    totalScore: number;
    highestScore: number;
    averageScore: number;
    achievements: string[];
    categoryStats: {
        categoryId: string;
        attempts: number;
        completed: number;
        averageScore: number;
        lastAttempt: Date;
    }[];
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    totalQuizzes: {
        type: Number,
        default: 0,
        min: 0
    },
    totalScore: {
        type: Number,
        default: 0,
        min: 0
    },
    highestScore: {
        type: Number,
        default: 0,
        min: 0
    },
    averageScore: {
        type: Number,
        default: 0,
        min: 0
    },
    achievements: [{
        type: String,
        trim: true
    }],
    categoryStats: [{
        categoryId: {
            type: String,
            required: true,
            trim: true
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0
        },
        completed: {
            type: Number,
            default: 0,
            min: 0
        },
        averageScore: {
            type: Number,
            default: 0,
            min: 0
        },
        lastAttempt: {
            type: Date,
            default: Date.now
        }
    }],
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better performance (only additional indexes, not duplicating field-level indexes)
UserSchema.index({ createdAt: -1 });
UserSchema.index({ totalScore: -1 });

let UserModel: mongoose.Model<IUser>;

export const getUserModel = async (): Promise<mongoose.Model<IUser>> => {
    if (UserModel) {
        return UserModel;
    }

    const connection = await connectMongoose(DB_NAMES.USERS);
    UserModel = connection.model<IUser>('User', UserSchema);
    return UserModel;
};