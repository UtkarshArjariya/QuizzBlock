import { getUserModel, IUser } from './models/User';

export interface UserProfile {
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

export const mongoUserStore = {
    // Create or update user profile
    upsertUser: async (walletAddress: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
        try {
            const UserModel = await getUserModel();

            const user = await UserModel.findOneAndUpdate(
                { walletAddress: walletAddress },
                {
                    $set: {
                        ...userData,
                        walletAddress: walletAddress,
                        lastLoginAt: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            ).exec();

            return {
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                totalQuizzes: user.totalQuizzes,
                totalScore: user.totalScore,
                highestScore: user.highestScore,
                averageScore: user.averageScore,
                achievements: user.achievements,
                categoryStats: user.categoryStats || [],
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            console.error('Error upserting user in MongoDB:', error);
            throw error;
        }
    },

    // Get user by wallet address
    getUserByWallet: async (walletAddress: string): Promise<UserProfile | null> => {
        try {
            const UserModel = await getUserModel();
            const user = await UserModel.findOne({
                walletAddress: walletAddress
            }).exec();

            if (!user) {
                return null;
            }

            return {
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                totalQuizzes: user.totalQuizzes,
                totalScore: user.totalScore,
                highestScore: user.highestScore,
                averageScore: user.averageScore,
                achievements: user.achievements,
                categoryStats: user.categoryStats || [],
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            console.error('Error getting user from MongoDB:', error);
            return null;
        }
    },

    // Update user stats after quiz completion
    updateUserStats: async (
        walletAddress: string,
        quizScore: number,
        isQuizCompleted: boolean = true
    ): Promise<boolean> => {
        try {
            const UserModel = await getUserModel();

            // Get current user stats
            const user = await UserModel.findOne({
                walletAddress: walletAddress
            }).exec();

            if (!user) {
                return false;
            }

            const newTotalQuizzes = isQuizCompleted ? user.totalQuizzes + 1 : user.totalQuizzes;
            const newTotalScore = user.totalScore + quizScore;
            const newHighestScore = Math.max(user.highestScore, quizScore);
            const newAverageScore = newTotalQuizzes > 0 ? Math.round(newTotalScore / newTotalQuizzes) : 0;

            await UserModel.updateOne(
                { walletAddress: walletAddress },
                {
                    $set: {
                        totalQuizzes: newTotalQuizzes,
                        totalScore: newTotalScore,
                        highestScore: newHighestScore,
                        averageScore: newAverageScore,
                        lastLoginAt: new Date()
                    }
                }
            ).exec();

            return true;
        } catch (error) {
            console.error('Error updating user stats in MongoDB:', error);
            return false;
        }
    },

    // Get leaderboard
    getLeaderboard: async (limit: number = 10): Promise<UserProfile[]> => {
        try {
            const UserModel = await getUserModel();
            const users = await UserModel
                .find({})
                .sort({ totalScore: -1, averageScore: -1, totalQuizzes: -1 })
                .limit(limit)
                .exec();

            return users.map(user => ({
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                totalQuizzes: user.totalQuizzes,
                totalScore: user.totalScore,
                highestScore: user.highestScore,
                averageScore: user.averageScore,
                achievements: user.achievements,
                categoryStats: user.categoryStats || [],
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
        } catch (error) {
            console.error('Error getting leaderboard from MongoDB:', error);
            return [];
        }
    },

    // Add achievement to user
    addAchievement: async (walletAddress: string, achievement: string): Promise<boolean> => {
        try {
            const UserModel = await getUserModel();

            await UserModel.updateOne(
                {
                    walletAddress: walletAddress,
                    achievements: { $ne: achievement } // Only add if not already present
                },
                {
                    $addToSet: { achievements: achievement }
                }
            ).exec();

            return true;
        } catch (error) {
            console.error('Error adding achievement in MongoDB:', error);
            return false;
        }
    },

    // Get user statistics
    getUserStats: async (walletAddress: string): Promise<{
        totalQuizzes: number;
        totalScore: number;
        averageScore: number;
        highestScore: number;
        rank?: number;
    } | null> => {
        try {
            const UserModel = await getUserModel();
            const user = await UserModel.findOne({
                walletAddress: walletAddress
            }).exec();

            if (!user) {
                return null;
            }

            // Calculate user rank
            const higherScoreUsers = await UserModel.countDocuments({
                totalScore: { $gt: user.totalScore }
            }).exec();

            const rank = higherScoreUsers + 1;

            return {
                totalQuizzes: user.totalQuizzes,
                totalScore: user.totalScore,
                averageScore: user.averageScore,
                highestScore: user.highestScore,
                rank
            };
        } catch (error) {
            console.error('Error getting user stats from MongoDB:', error);
            return null;
        }
    },

    // Delete user (for privacy compliance)
    deleteUser: async (walletAddress: string): Promise<boolean> => {
        try {
            const UserModel = await getUserModel();
            const result = await UserModel.deleteOne({
                walletAddress: walletAddress
            }).exec();

            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting user from MongoDB:', error);
            return false;
        }
    },

    // Record quiz completion and update user stats
    recordQuizCompletion: async (walletAddress: string, quizData: {
        categoryId: string;
        quizId: string;
        score: number;
        responses: any[];
        questionsAttempted?: number;
        correctAnswers?: number;
        totalQuestions?: number;
        completedAt: Date;
    }): Promise<UserProfile> => {
        try {
            const UserModel = await getUserModel();

            // Get current user data
            let user = await UserModel.findOne({ walletAddress: walletAddress }).exec();

            // Create user if they don't exist
            if (!user) {
                user = new UserModel({
                    walletAddress: walletAddress,
                    totalQuizzes: 0,
                    totalScore: 0,
                    highestScore: 0,
                    averageScore: 0,
                    achievements: [],
                    categoryStats: [],
                    lastLoginAt: new Date()
                });
            }

            // Update overall user stats
            const newTotalQuizzes = user.totalQuizzes + 1;
            const newTotalScore = user.totalScore + quizData.score;
            const newHighestScore = Math.max(user.highestScore, quizData.score);
            const newAverageScore = Math.round(newTotalScore / newTotalQuizzes);

            // Update or create category stats
            const categoryStats = user.categoryStats || [];
            const existingCategoryIndex = categoryStats.findIndex(cat => cat.categoryId === quizData.categoryId);

            if (existingCategoryIndex >= 0) {
                // Update existing category stats
                const existingCategory = categoryStats[existingCategoryIndex];
                const newAttempts = existingCategory.attempts + 1;
                const newCompleted = existingCategory.completed + 1;
                const newCategoryTotal = (existingCategory.averageScore * existingCategory.completed) + quizData.score;
                const newCategoryAverage = Math.round(newCategoryTotal / newCompleted);

                categoryStats[existingCategoryIndex] = {
                    categoryId: quizData.categoryId,
                    attempts: newAttempts,
                    completed: newCompleted,
                    averageScore: newCategoryAverage,
                    lastAttempt: quizData.completedAt
                };
            } else {
                // Create new category stats
                categoryStats.push({
                    categoryId: quizData.categoryId,
                    attempts: 1,
                    completed: 1,
                    averageScore: quizData.score,
                    lastAttempt: quizData.completedAt
                });
            }

            // Update user document with both overall and category stats
            const updatedUser = await UserModel.findOneAndUpdate(
                { walletAddress: walletAddress },
                {
                    $set: {
                        totalQuizzes: newTotalQuizzes,
                        totalScore: newTotalScore,
                        highestScore: newHighestScore,
                        averageScore: newAverageScore,
                        categoryStats: categoryStats,
                        lastLoginAt: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            ).exec();

            console.log('Quiz completion recorded for:', walletAddress, {
                category: quizData.categoryId,
                score: quizData.score,
                newTotalQuizzes,
                newAverageScore,
                categoryStats: categoryStats.length
            });

            return {
                walletAddress: updatedUser.walletAddress,
                username: updatedUser.username,
                email: updatedUser.email,
                totalQuizzes: updatedUser.totalQuizzes,
                totalScore: updatedUser.totalScore,
                highestScore: updatedUser.highestScore,
                averageScore: updatedUser.averageScore,
                achievements: updatedUser.achievements,
                categoryStats: updatedUser.categoryStats || [],
                lastLoginAt: updatedUser.lastLoginAt,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            console.error('Error recording quiz completion:', error);
            throw error;
        }
    }
};