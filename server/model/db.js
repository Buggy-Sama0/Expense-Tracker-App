import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

// Create expense schema
const expenseSchema = new mongoose.Schema({
    userId: String,
    description: String,
    amount: Number,
    category: String,
    date: {
        type: Date,
        default: Date.now
    }
});

export const Expense = mongoose.model('Expense', expenseSchema);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model('User', userSchema);