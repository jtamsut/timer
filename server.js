const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./time_records.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    total_seconds INTEGER NOT NULL
)`);

// Routes
app.post('/save-time', (req, res) => {
    const { date, seconds } = req.body;

    db.get(`SELECT * FROM records WHERE date = ?`, [date], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        } else if (row) {
            // Update existing record
            const newTotal = row.total_seconds + seconds;
            db.run(`UPDATE records SET total_seconds = ? WHERE date = ?`, [newTotal, date], function(err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Database error' });
                } else {
                    res.json({ message: 'Time updated', date: date, total_seconds: newTotal });
                }
            });
        } else {
            // Insert new record
            db.run(`INSERT INTO records (date, total_seconds) VALUES (?, ?)`, [date, seconds], function(err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Database error' });
                } else {
                    res.json({ message: 'Time saved', date: date, total_seconds: seconds });
                }
            });
        }
    });
});

app.get('/get-history', (req, res) => {
    db.all(`SELECT * FROM records ORDER BY date DESC`, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        } else {
            res.json(rows);
        }
    });
});

// Serve the frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
