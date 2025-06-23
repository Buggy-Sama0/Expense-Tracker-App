require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser')
const { connectDB, Expense, User } = require('./model/db');
const { auth, JWT_SECRET } = require('./middleware/auth');

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
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false
    });

    res.redirect("/login");
});


// Authentication Routes
app.post('/api/register', async (req, res) => {
    console.log('Registration attempt:', req.body); // Add this line
    try {
        const { username, email, password, firstName, lastName } = req.body;

         // Log the received data
        console.log('Received registration data:', { firstName, lastName, username, email, password });

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user =new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        await user.save();

        // Generate token
        
        const token=jwt.sign(
            {id:user._id, email}, 
            JWT_SECRET, 
            {
                expiresIn:"2h"
            }
        );

        user.password=undefined;
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});


app.get('/api/login', async (req, res) => {

    try {
        res.status(201).json({
            message: 'Login Page', ff:'ss'
    })
    } catch(err) {
        res.status(500).json({ error: 'Error loading login PAGE' });
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message:'Invalid Credentials'})
        }
        // Match the password
        const pw=await bcrypt.compare(password, user.password)

        console.log(pw);
        if(pw) {
            const token=jwt.sign(
            {id: user._id},
            JWT_SECRET, 
                {
                    expiresIn:"2h"
                }   
            );

            user.password=undefined

            const options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly: true
            };
            
            res.status(200).cookie("token", token, options).json({
                success:'Login Successfull',
                token,
                user
            })
        } 

        return res.status(401).json({message:'Invalid Credentials'})
        
        //res.redirect('/api/showExpense')
      
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Error during login' });
    }
});


/*
// Protected route to get user profile
app.get('/api/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});*/

// Dashboard route
/*
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
});*/

// Get list of expenses
app.get("/api/showExpense", auth, async (req, res) => {
    try {
        const currentUser=await User.findById(req.user.id)
        const currentUserId = currentUser._id;
        const expenses = await Expense.find({userId:currentUserId})
            .select('description amount category date')
            .sort({ date: -1 });
        res.status(200).json(expenses);


    } catch (err) {
        console.error("Error retrieving expenses:", err);
        
        res.status(500).json({ err: 'Retrieval Data Failed'});
    }
});

// Add Expense
app.post("/api/addExpense", auth, async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;

        const currentUser=await User.findById(req.user.id)
        //console.log(typeof currentUser);

        if (!currentUser) {
            throw new Errr()
        }

        const iidd=currentUser._id
        
        const newExpense = new Expense({
            userId: currentUser._id,
            description,
            amount, 
            category,
            date: new Date(date),
        });
        const savedExpense = await newExpense.save();
        res.status(201).json({ 
            message: 'Expense recorded',
            result: savedExpense,
            postData: { description, amount, category, date, iidd}
        });
    } catch (err) {
        console.error("Error saving expense:", err);
        res.status(500).json({ message: "Error saving expense" });
    }
});

// Delete Expense
app.delete('/api/deleteExpense/:description', auth, async (req, res) => {
    try {
        const currentUser=await User.findById(req.user.id)
        const currentUserId = currentUser._id;
        const result = await Expense.deleteOne({ description: req.params.description, userId:currentUserId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                message: 'No expense found with that description' 
            });
        }
        res.status(200).json({ message: 'Expense Deleted', result, url:req.url});
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ message: "Error deleting expense" });
    }
});

const PORT = process.env.PORT || 2025;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

