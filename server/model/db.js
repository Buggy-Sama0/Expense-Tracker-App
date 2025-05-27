require('dotenv').config();
// For MySQL
let mysql=require('mysql');

const connection=mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'expense'
});

connection.connect((err)=>{
    if (err) return console.log(err.message);

    console.log('Connected to the MySql server'); 
});

module.exports=connection;