const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 50,
    queueLimit: process.env.DB_QUEUE_LIMIT || 0,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS || true,
    port: process.env.DB_PORT || 3306 ,
    dateStrings: ['DATE', 'DATETIME']
};

const pool = mysql.createPool(dbConfig);



module.exports = pool;

