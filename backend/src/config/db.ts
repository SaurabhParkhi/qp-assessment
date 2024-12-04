import mysql from "mysql2";

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 's@aurabh321#', 
    database: 'qpassignment',
});


db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1); // Exit the application if database connection fails
    }
    console.log('Connected to the database');
});

export default db;