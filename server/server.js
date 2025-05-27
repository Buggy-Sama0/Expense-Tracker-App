require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB, Expense } = require('./model/db');

// Connect to MongoDB
connectDB();

const corsOptions = {
    origin: ['http://localhost:5173',
        'https://expense-tracker-app-4fiq.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false
    });

    res.redirect("/dashboard");
});

app.get('/dashboard', async (req, res) => {
    try {
        const expenses = await Expense.find()
            .select('description amount category date')
            .sort({ date: -1 })
            .limit(5); // Get latest 5 expenses for dashboard
        res.status(200).json({
            success: true,
            data: expenses
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: 'Error loading dashboard data' });
    }
});

// Get list of expenses
app.get("/api/showExpense", async (req, res) => {
    try {
        const expenses = await Expense.find()
            .select('description amount category date')
            .sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (err) {
        console.error("Error retrieving expenses:", err);
        res.status(500).json({ err: 'Retrieval Data Failed' });
    }
});

// Add Expense
app.post("/api/addExpense", async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const newExpense = new Expense({
            description,
            amount,
            category,
            date: new Date(date)
        });
        const savedExpense = await newExpense.save();
        res.status(201).json({ 
            message: 'Expense recorded',
            result: savedExpense,
            postData: { description, amount, category, date }
        });
    } catch (err) {
        console.error("Error saving expense:", err);
        res.status(500).json({ message: "Error saving expense" });
    }
});

// Delete Expense
app.delete('/api/deleteExpense/:description', async (req, res) => {
    try {
        const result = await Expense.deleteOne({ description: req.params.description });
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                message: 'No expense found with that description' 
            });
        }
        res.status(200).json({ message: 'Expense Deleted', result });
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ message: "Error deleting expense" });
    }
});

const PORT = process.env.PORT || 2025;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

