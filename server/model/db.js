require('dotenv').config();
// For MySQL
let mysql=require('mysql');

const connection=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err)=>{
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Connected to the MySql server'); 
});

// Add error handler for lost connections
mysqlConnection.on('error', function(err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Reconnect if connection is lost
        mysqlConnection.connect((err) => {
            if (err) {
                console.error('Error reconnecting:', err);
            }
        });
    } else {
        throw err;
    }
});


module.exports=connection;