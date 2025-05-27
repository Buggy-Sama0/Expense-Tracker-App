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

module.exports = { connectDB, Expense };