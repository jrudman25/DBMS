const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();

app.use(cors());

const config = {
    user: 'admin',
    password: 'FLycb7A2hEUWV*NmpZcb',
    server: 'stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433',
    database: 'SlayTheSpireStats'
};

let pool;

app.get('/status', async (req, res) => {
    if (!pool) {
        res.send({ status: 'Not Connected' });
        return;
    }

    try {
        await pool.query`SELECT 1`;
        res.send({ status: 'Connected' });
    } catch (err) {
        console.error(err);
        res.send({ status: 'Error' });
    }
});

app.get('/open', async (req, res) => {
    try {
        pool = await sql.connect(config);
        res.send({ status: 'Connected' });
    } catch (err) {
        console.error(err);
        res.send({ status: 'Error' });
    }
});

app.get('/close', async (req, res) => {
    if (!pool) {
        res.send({ status: 'Not Connected' });
        return;
    }

    try {
        await pool.close();
        pool = null;
        res.send({ status: 'Not Connected' });
    } catch (err) {
        console.error(err);
        res.send({ status: 'Error' });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
