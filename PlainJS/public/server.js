const express = require('express');
const app = express();
const port = 3000;

const sql = require('mssql');
const cors = require('cors');

const config = {
    user: 'admin',
    password: 'FLycb7A2hEUWV*NmpZcb',
    server: 'stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433',
    database: 'SlayTheSpireStats',
};

app.use(cors());

app.get('/batadase/public/test-connection', (req, res) => {
    sql.connect(config).then(() => {
        res.status(200).send('Connection successful');
    }).catch((err) => {
        console.error(`Error connecting to SQL server: ${err}`);
        res.status(500).send(`Connection failed: ${err}`);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
