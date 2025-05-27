require('dotenv').config();
// For MySQL
let mysql=require('mysql');

// Create connection pool instead of single connection
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});
connection.connect((err)=>{
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Connected to the MySql server'); 
});


module.exports=connection;