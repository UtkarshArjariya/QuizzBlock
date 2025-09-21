// MongoDB Data Migration Script
// This script migrates existing question data to MongoDB

import { mongoQuestionStore } from '../lib/mongoQuestionStore';

// Import existing question data
import biologyQuestions from '../data/biologyQuestions';
import chemistryQuestions from '../data/chemistryQuestions';
import csQuestions from '../data/csQuestions';
import dsQuestions from '../data/dsQuestions';
import physicsQuestions from '../data/physicsQuestions';
import programmingQuestions from '../data/programmingQuestions';

interface LegacyQuestion {
    text: string;
    options: Array<{
        text: string;
        isCorrect: boolean;
    }>;
    difficulty?: string;
}

// Function to convert legacy question format to new MongoDB format
const convertQuestion = (
    legacyQuestion: LegacyQuestion,
    category: string,
    index: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
) => {
    return {
        questionId: `${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
        text: legacyQuestion.text,
        options: legacyQuestion.options.map((opt, optIndex) => ({
            id: `${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}-opt${optIndex + 1}`,
            text: opt.text,
            isCorrect: opt.isCorrect
        })),
        category: category,
        difficulty: legacyQuestion.difficulty as 'easy' | 'medium' | 'hard' || difficulty,
        points: 100,
        timeLimit: 30,
        explanation: undefined,
        tags: [category.toLowerCase()],
        isActive: true
    };
};

// Function to migrate questions for a specific category
const migrateCategory = async (
    questions: LegacyQuestion[],
    categoryName: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
) => {
    console.log(`\nMigrating ${questions.length} ${categoryName} questions...`);

    let successCount = 0;
    let errorCount = 0;

    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        try {
            const convertedQuestion = convertQuestion(question, categoryName, index, difficulty);
            await mongoQuestionStore.createQuestion(convertedQuestion);
            successCount++;
        } catch (error) {
            console.error(`Error migrating question ${index + 1}:`, error);
            errorCount++;
        }
    }

    console.log(`${categoryName}: ${successCount} successful, ${errorCount} errors`);
    return { successCount, errorCount };
};

// Main migration function
export const migrateAllQuestions = async () => {
    console.log('Starting question migration to MongoDB...');

    const migrationResults = [];

    try {
        // Migrate each category
        migrationResults.push(await migrateCategory(biologyQuestions, 'Biology', 'medium'));
        migrationResults.push(await migrateCategory(chemistryQuestions, 'Chemistry', 'medium'));
        migrationResults.push(await migrateCategory(csQuestions, 'Computer Science', 'medium'));
        migrationResults.push(await migrateCategory(dsQuestions, 'Data Structures', 'hard'));
        migrationResults.push(await migrateCategory(physicsQuestions, 'Physics', 'medium'));
        migrationResults.push(await migrateCategory(programmingQuestions, 'Programming', 'hard'));

        // Calculate totals
        const totalSuccess = migrationResults.reduce((sum, result) => sum + result.successCount, 0);
        const totalErrors = migrationResults.reduce((sum, result) => sum + result.errorCount, 0);

        console.log('\n=== Migration Summary ===');
        console.log(`Total questions migrated: ${totalSuccess}`);
        console.log(`Total errors: ${totalErrors}`);
        console.log('Migration completed successfully!');

        return { totalSuccess, totalErrors };
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

// Run migration if this file is executed directly
if (require.main === module) {
    migrateAllQuestions()
        .then(() => {
            console.log('Migration script completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Migration script failed:', error);
            process.exit(1);
        });
}