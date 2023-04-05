const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433',
    user: 'admin',
    password: 'FLycb7A2hEUWV*NmpZcb',
    database: 'SlayTheSpireStats'
});

app.get('/api/check-connection', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Error getting database connection');
        } else {
            connection.release();
            res.send('Connected');
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
