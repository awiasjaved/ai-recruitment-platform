const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// ============================================
// MySQL Connection Pool
// ============================================
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection test
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection FAIL:', err.message);
    } else {
        console.log('Database Connected Successfully!');
        connection.release();
    }
});

module.exports = pool.promise();