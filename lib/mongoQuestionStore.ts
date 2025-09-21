import { getQuestionModel, IQuestion, IQuestionOption } from './models/Question';

export interface QuestionData {
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

export const mongoQuestionStore = {
    // Create a new question
    createQuestion: async (questionData: Omit<QuestionData, 'createdAt' | 'updatedAt' | 'usageCount' | 'correctAnswerRate'>): Promise<QuestionData> => {
        try {
            const QuestionModel = await getQuestionModel();

            const question = new QuestionModel({
                ...questionData,
                usageCount: 0,
                correctAnswerRate: 0
            });

            await question.save();

            return {
                questionId: question.questionId,
                text: question.text,
                options: question.options,
                category: question.category,
                difficulty: question.difficulty,
                points: question.points,
                timeLimit: question.timeLimit,
                explanation: question.explanation,
                tags: question.tags,
                isActive: question.isActive,
                usageCount: question.usageCount,
                correctAnswerRate: question.correctAnswerRate,
                createdBy: question.createdBy,
                createdAt: question.createdAt,
                updatedAt: question.updatedAt
            };
        } catch (error) {
            console.error('Error creating question in MongoDB:', error);
            throw error;
        }
    },

    // Get question by ID
    getQuestionById: async (questionId: string): Promise<QuestionData | null> => {
        try {
            const QuestionModel = await getQuestionModel();
            const question = await QuestionModel.findOne({ questionId }).exec();

            if (!question) {
                return null;
            }

            return {
                questionId: question.questionId,
                text: question.text,
                options: question.options,
                category: question.category,
                difficulty: question.difficulty,
                points: question.points,
                timeLimit: question.timeLimit,
                explanation: question.explanation,
                tags: question.tags,
                isActive: question.isActive,
                usageCount: question.usageCount,
                correctAnswerRate: question.correctAnswerRate,
                createdBy: question.createdBy,
                createdAt: question.createdAt,
                updatedAt: question.updatedAt
            };
        } catch (error) {
            console.error('Error getting question from MongoDB:', error);
            return null;
        }
    },

    // Get questions by category and difficulty
    getQuestionsByFilters: async (filters: {
        category?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        tags?: string[];
        limit?: number;
        isActive?: boolean;
    }): Promise<QuestionData[]> => {
        try {
            const QuestionModel = await getQuestionModel();

            const query: any = {};

            if (filters.category) {
                query.category = filters.category;
            }

            if (filters.difficulty) {
                query.difficulty = filters.difficulty;
            }

            if (filters.tags && filters.tags.length > 0) {
                query.tags = { $in: filters.tags };
            }

            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            } else {
                query.isActive = true; // Default to active questions only
            }

            const questions = await QuestionModel
                .find(query)
                .limit(filters.limit || 50)
                .sort({ createdAt: -1 })
                .exec();

            return questions.map(question => ({
                questionId: question.questionId,
                text: question.text,
                options: question.options,
                category: question.category,
                difficulty: question.difficulty,
                points: question.points,
                timeLimit: question.timeLimit,
                explanation: question.explanation,
                tags: question.tags,
                isActive: question.isActive,
                usageCount: question.usageCount,
                correctAnswerRate: question.correctAnswerRate,
                createdBy: question.createdBy,
                createdAt: question.createdAt,
                updatedAt: question.updatedAt
            }));
        } catch (error) {
            console.error('Error getting questions from MongoDB:', error);
            return [];
        }
    },

    // Get random questions for quiz
    getRandomQuestions: async (filters: {
        category?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        count: number;
    }): Promise<QuestionData[]> => {
        try {
            const QuestionModel = await getQuestionModel();

            const matchQuery: any = { isActive: true };

            if (filters.category) {
                matchQuery.category = filters.category;
            }

            if (filters.difficulty) {
                matchQuery.difficulty = filters.difficulty;
            }

            const questions = await QuestionModel.aggregate([
                { $match: matchQuery },
                { $sample: { size: filters.count } }
            ]).exec();

            return questions.map(question => ({
                questionId: question.questionId,
                text: question.text,
                options: question.options,
                category: question.category,
                difficulty: question.difficulty,
                points: question.points,
                timeLimit: question.timeLimit,
                explanation: question.explanation,
                tags: question.tags,
                isActive: question.isActive,
                usageCount: question.usageCount,
                correctAnswerRate: question.correctAnswerRate,
                createdBy: question.createdBy,
                createdAt: question.createdAt,
                updatedAt: question.updatedAt
            }));
        } catch (error) {
            console.error('Error getting random questions from MongoDB:', error);
            return [];
        }
    },

    // Update question usage statistics
    updateQuestionStats: async (questionId: string, isCorrect: boolean): Promise<boolean> => {
        try {
            const QuestionModel = await getQuestionModel();

            const question = await QuestionModel.findOne({ questionId }).exec();
            if (!question) {
                return false;
            }

            const newUsageCount = question.usageCount + 1;
            const correctAnswers = isCorrect ?
                Math.round((question.correctAnswerRate * question.usageCount) / 100) + 1 :
                Math.round((question.correctAnswerRate * question.usageCount) / 100);

            const newCorrectAnswerRate = Math.round((correctAnswers / newUsageCount) * 100);

            await QuestionModel.updateOne(
                { questionId },
                {
                    $set: {
                        usageCount: newUsageCount,
                        correctAnswerRate: newCorrectAnswerRate
                    }
                }
            ).exec();

            return true;
        } catch (error) {
            console.error('Error updating question stats in MongoDB:', error);
            return false;
        }
    },

    // Update question
    updateQuestion: async (questionId: string, updates: Partial<QuestionData>): Promise<boolean> => {
        try {
            const QuestionModel = await getQuestionModel();

            const result = await QuestionModel.updateOne(
                { questionId },
                { $set: updates }
            ).exec();

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating question in MongoDB:', error);
            return false;
        }
    },

    // Deactivate question (soft delete)
    deactivateQuestion: async (questionId: string): Promise<boolean> => {
        try {
            const QuestionModel = await getQuestionModel();

            const result = await QuestionModel.updateOne(
                { questionId },
                { $set: { isActive: false } }
            ).exec();

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error deactivating question in MongoDB:', error);
            return false;
        }
    },

    // Get question statistics
    getQuestionStats: async (): Promise<{
        totalQuestions: number;
        activeQuestions: number;
        questionsByCategory: { [category: string]: number };
        questionsByDifficulty: { [difficulty: string]: number };
    }> => {
        try {
            const QuestionModel = await getQuestionModel();

            const [
                totalQuestions,
                activeQuestions,
                categoryStats,
                difficultyStats
            ] = await Promise.all([
                QuestionModel.countDocuments({}).exec(),
                QuestionModel.countDocuments({ isActive: true }).exec(),
                QuestionModel.aggregate([
                    { $group: { _id: '$category', count: { $sum: 1 } } }
                ]).exec(),
                QuestionModel.aggregate([
                    { $group: { _id: '$difficulty', count: { $sum: 1 } } }
                ]).exec()
            ]);

            const questionsByCategory: { [category: string]: number } = {};
            categoryStats.forEach(stat => {
                questionsByCategory[stat._id] = stat.count;
            });

            const questionsByDifficulty: { [difficulty: string]: number } = {};
            difficultyStats.forEach(stat => {
                questionsByDifficulty[stat._id] = stat.count;
            });

            return {
                totalQuestions,
                activeQuestions,
                questionsByCategory,
                questionsByDifficulty
            };
        } catch (error) {
            console.error('Error getting question stats from MongoDB:', error);
            return {
                totalQuestions: 0,
                activeQuestions: 0,
                questionsByCategory: {},
                questionsByDifficulty: {}
            };
        }
    }
};