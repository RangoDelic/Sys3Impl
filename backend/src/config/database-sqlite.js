const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file path
const dbPath = path.join(__dirname, '../data/gene_detective.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const promiseDb = {
    execute: (query, params = []) => {
        return new Promise((resolve, reject) => {
            if (query.trim().toUpperCase().startsWith('INSERT') || 
                query.trim().toUpperCase().startsWith('UPDATE') || 
                query.trim().toUpperCase().startsWith('DELETE')) {
                db.run(query, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
                    }
                });
            } else {
                db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([rows]);
                    }
                });
            }
        });
    }
};

// Initialize database schema
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const schema = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                date_birth DATE,
                user_role INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                medical_history TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS genetic_counselors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                specialization VARCHAR(100),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS researchers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                institution VARCHAR(100),
                research_area VARCHAR(100),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS genetic_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                genetic_data_raw TEXT,
                ancestry_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS gene_expressions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                gene_expression_result TEXT,
                analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
            );
        `;

        db.exec(schema, (err) => {
            if (err) {
                console.error('Database initialization error:', err);
                reject(err);
            } else {
                console.log('SQLite database initialized successfully');
                resolve();
            }
        });
    });
};

module.exports = { db: promiseDb, initializeDatabase };