const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors');
const PORT =  8000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'brunadb'
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/getdatafromdb', (req, res) => {
    const query = req.body.query;

    db.query(query, (err, results, fields) => {
        if (err) {
            return res.status(500).send('error: ' + err.message);
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

app.listen(PORT, () => {
    console.log(`сервер запущен`);
});
