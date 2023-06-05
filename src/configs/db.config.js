require('dotenv').config()
const mysql = require('mysql');


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

};

const connection = mysql.createConnection(dbConfig);

connection.connect((error) => {
    if (error) {
        console.error('Failed to connect to the database:', error);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;
