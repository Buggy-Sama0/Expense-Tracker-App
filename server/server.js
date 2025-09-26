import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { connectDB, Expense, User } from './model/db.js';
import { auth, JWT_SECRET } from './middleware/auth.js';
import fs from 'fs';
//import PDFExtract from 'pdf.js-extract';
import { createWorker } from 'tesseract.js';
//import scribe from 'scribe.js-ocr';
import multer from 'multer';
//import imgConverter from 'pdftoimg-js';
//import { fromBuffer } from 'pdf2pic';
import path from 'path';
import {createCompletion} from './services/deepseekService.js';
import {sendEmail} from './services/sendEmail.js'

dotenv.config();

// Connect to MongoDB
connectDB();


const app = express();
const corsOptions = {
    origin: ['http://localhost:5173',
        'https://expense-tracker-app-4fiq.vercel.app'
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Set up multer for file uploads
const upload = multer();


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
            message: 'Login Page', ff: 'ss'
        });
    } catch (err) {
        res.status(500).json({ error: 'Error loading login PAGE' });
    }
});

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

app.post('/api/forgot-password', async (req, res) => {
    try {
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const link=`${process.env.ALLOWED_ORIGINS}/reset-password`
        await sendEmail(email, 'Password Reset', link)
        res.send("password reset link sent to your email account");
    } catch(error) {
        res.send("An error occured");
        console.log(error);
    }
})

// Reset Password
app.post('/api/reset-password/:email', async (req, res) => {
    try {
        const {email}=req.params;
        const user=await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const hashedPassword=await bcrypt.hash(req.body.password, 10)
        user.password=hashedPassword
        await user.save();
        res.status(200).json({message: 'Password reset successfully'})
    } catch(error) {
        res.send("An error occured");
        console.log(error);
    }
})

// Protected route to get user profile
app.get('/api/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('username');

        res.json(user);
    } catch (err) {
        console.log(req.user.id);
        
        res.status(500).json({ message: 'Error fetching user data',
            data: req.user.id
         });
    }
});

// Dashboard route
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
app.get("/api/showExpense", auth, async (req, res) => {
    try {
    const currentUser = await User.findById(req.user.id);
    const currentUserId = currentUser._id;
    const expenses = await Expense.find({ userId: currentUserId })
            .select('description amount category date')
            .sort({ date: -1 });
        res.status(200).json(expenses);

    } catch (err) {
        console.error("Error retrieving expenses:", err);
        
        res.status(500).json({ err: 'Retrieval Data Failed' });
    }
});

// Add Expense
app.post("/api/addExpense", auth, async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const currentUser = await User.findById(req.user.id);
        //console.log(typeof currentUser);

        if (!currentUser) {
                throw new Errr();
            }

        const iidd = currentUser._id;
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
                postData: { description, amount, category, date, iidd }
            });
        } catch (err) {
            console.error("Error saving expense:", err);
            res.status(500).json({ message: "Error saving expense" });
        }
});

// Delete Expense
app.delete('/api/deleteExpense/:description', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
    const currentUserId = currentUser._id;
    const result = await Expense.deleteOne({ description: req.params.description, userId: currentUserId });
    if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'No expense found with that description'
            });
        }
        res.status(200).json({ message: 'Expense Deleted', result, url: req.url });
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ message: "Error deleting expense" });
    }
});

// Process pdf files
app.post('/api/processIMG', upload.single('ImgFile'), async (req, res) => {
    try {
        const file = req.file;
        //const dataBuffer=fs.readFileSync(file);
        if (!file) {
            console.log('no file');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        let extractedText = '';
        let ai_response = '';
        if (file.mimetype.startsWith('application/')) {
            // Convert PDF to images using pdf2pic
            //extractedText = await scribe.extractText([file.buffer]);
        } else if (file.mimetype.startsWith('image/')) {
            extractedText = await extractTextFromImg(file.buffer);
            ai_response=await parseTransactionsFromText(extractedText);
        }
        //console.log(ai_response);
        res.status(200).json({ uploaded_file: file, paramText: extractedText, AI_Response: ai_response });
    } catch (error) {
        console.error('Error file process: ', error);
        res.status(500).json({ message: 'Error processing the file' });
    }
});

// PLACEHOLDER FUNCTIONS - ADD YOUR LOGIC HERE
//  Extract the texts from the upload image
async function extractTextFromImg(file) {
    //const dataBuffer=fs.readFileSync(file);
    /*
    const options = {};
    pdfExtract.extractBuffer(file, options, (err, data) => {
        if (err) return console.log(err);
        console.log(data);
    })*/
    const worker = await createWorker('eng');
    const ret = await worker.recognize(file);
    console.log(ret);
    await worker.terminate();
    return ret.data.text;
}

// filtering text to provide a organized list of expense
async function parseTransactionsFromText(texts) {
    // Implement your transaction parsing logic:
    // - Regex patterns for your specific bank format
    // - AI parsing with OpenAI API
    try {
        const prompt=`Extract all expenses from the receipt/text. For each expense item found, extract these 4 fields::
            1. Description of goods/services
            2. Total price/amount (Note: always retuen with prefix HK$, example(HK$ 294.00))
            3. Date of transaction
            4. Category (choose strictly from: Food, Bill, Utility, Travel)

            The fields name should be [description, total_price, date, category] all in small letter and none other that.

            Ignore all other information. 
            Return as a JSON array of objects. If no expenses are found, return an empty array. 
            If any category field is missing or unclear for a specific item, don't return "unknown", assign the suitable list of category based on the description.`

        if (!prompt) {
            return res.status(400).json({message:'Text is empty'})
        }
        const response=await createCompletion(texts+'. '+prompt);
        return response;
        //return texts+'. '+prompt;
    } catch(error) {
        console.log(error.message);
    }
}

async function categorizeTransactions(transactions) {
    // Implement AI categorization using OpenAI API
    return [];
}

const PORT = process.env.PORT || 2025;
app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
});
