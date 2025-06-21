require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
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

// Create expense model
const Expense = mongoose.model('Expense', expenseSchema);

// Create user schema
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

// Create user model
const User = mongoose.model('User', userSchema);

module.exports = { connectDB, Expense, User };