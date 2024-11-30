const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors');
const PORT =  8000;


const db = mysql.createConnection({
    host: '64.23.160.168',
    user: 'root',
    password: 'secret',
    database: 'brunadb'
});

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'brunadb'
// });

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/getdatafromdb', (req, res) => {
    const query = req.body.query;

    db.query(query, (err, results, fields) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (query.trim().toLowerCase().startsWith('select')) {
            const columns = fields.map(field => field.name);
            res.json({ type: 'select', columns, rows: results });
        } else {
            // Если это мод-й запрос, а не селект
            res.json({ type: 'update', affectedRows: results.affectedRows });
        }
    });
});

app.post('/databases', (req, res) => {
    db.query('SHOW DATABASES;', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const databases = results.map(row => row.Database);
        res.json(databases);
    });
});

app.listen(PORT, () => {
    console.log(`сервер запущен`);
});
