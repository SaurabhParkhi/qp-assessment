import mysql from "mysql2";

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'YOUR_PASSWORD', 
    database: 'qpassignment',
});


db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    }
    console.log('Connected to the database');
});

export default db;