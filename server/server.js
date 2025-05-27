require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser = require('body-parser');
const mysqlConnection=require('./model/db');



const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({
        activeStatus:true,
        error:false
    })
})

// Get list of expenses
app.get("/api/showExpense", (req, res) => {

    //const query='select * from expense_data';

    const query = `
        SELECT 
        description, 
        amount, 
        category, 
        DATE_FORMAT(date, '%Y-%m-%d') AS date 
        FROM expense_data
    `;

    mysqlConnection.query(query, 
        function (err, result) {
            if (err) {
                console.log("Error in retrieving the data");
                return res.status(500).json({err:'Retrieval Data Failed'});
            }

            res.status(200).json(result);
        }
    )
    
})


// Add Expense
app.post("/api/addExpense", (req, res) => {

    const {description, amount, category, date}= req.body;

    try {

        const query='insert into expense_data (description, amount, category, date) values (?, ?, ?, ?)';

        mysqlConnection.query(query, [description, amount, category, date], 
            function(err, result) {
                if(err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.status(200).json({ message: 'Expense recorded', result, 
                    postData: {description, amount, category, date}
                 });
            }
        )

    } catch (err) {
        // res.status(400).json(message:"Could not fetch", err)
        console.log(err);
        res.status(500).json({ message: "Error saving expense" });
    }
})


// Delete Expense
app.delete('/api/deleteExpense/:description', (req, res) => {

    try {
        const query='delete from expense_data where description=?';

        mysqlConnection.query(query, [req.params.description],
            (err, result) => {
                if(err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if(result.affectedRows===0) {
                    return res.status(404).json({ 
                    message: 'No expense found with that description' 
                    });
                }

                res.status(200).json({message:'Expense Deleted', result, url:req.url})
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting expense" });
    }
    
})


const PORT = process.env.PORT || 2025;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

