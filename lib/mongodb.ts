import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

// Lazy initialization - only check env vars when actually connecting
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClientPromise(): Promise<MongoClient> {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please add your MongoDB URI to .env.local');
    }

    if (clientPromise) {
        return clientPromise;
    }

    const uri = process.env.MONGODB_URI;

    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            const client = new MongoClient(uri);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        const client = new MongoClient(uri);
        clientPromise = client.connect();
    }

    return clientPromise;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default getMongoClientPromise;

// Database connection helpers for separate databases
export const connectToDatabase = async (dbName: string): Promise<Db> => {
    const client = await getMongoClientPromise();
    return client.db(dbName);
};

// Mongoose connections for different databases
const mongooseConnections: { [key: string]: mongoose.Connection } = {};

export const connectMongoose = async (dbName: string) => {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please add your MongoDB URI to .env.local');
    }

    if (mongooseConnections[dbName]) {
        return mongooseConnections[dbName];
    }

    // Create connection string with specific database name
    const connectionString = `${process.env.MONGODB_URI}${dbName}`;
    const connection = mongoose.createConnection(connectionString);
    mongooseConnections[dbName] = connection;
    return connection;
};

// Database names
export const DB_NAMES = {
    SESSIONS: 'quiz_sessions',
    USERS: 'quiz_users',
    QUESTIONS: 'quiz_questions'
} as const;