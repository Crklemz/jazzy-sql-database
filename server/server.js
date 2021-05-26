const express = require('express');
const bodyParser = require('body-parser');

const pg = require('pg');

const Pool = pg.Pool;
const pool = new Pool({
    database: 'jazzy_sql', //name of database
    host: 'localhost', //doesn't really ever change
    port: 5432, // doesn't really ever change
})
pool.on('connect', () => {
    console.log('CONNECTED TO POSTGRES');
})

pool.on('error', (error) => {
    console.log(error);
})

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

// TODO - Replace static content with a database tables

app.get('/artist', (req, res) => {

    const queryText = `SELECT * FROM "artist" ORDER BY "birthdate" DESC;`
    pool.query(queryText)
        .then((result) => {
            console.log(result.rows);
            res.send(result.rows);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.post('/artist', (req, res) => {
    console.log('req.body', req.body);

    let queryText = `INSERT INTO "artist"("name", "birthdate")
    VALUES ($1, $2);`

    let values = [req.body.name, req.body.birthdate];
    pool.query(queryText, values)
        .then((result) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.get('/song', (req, res) => {

    const queryText = `SELECT * FROM "song" ORDER BY "title";`
    pool.query(queryText)
        .then((result) => {
            console.log(result.rows);
            res.send(result.rows);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.post('/song', (req, res) => {
    console.log('req.body', req.body);

    let queryText = `INSERT INTO "song"("title", "length", "released")
        VALUES ($1, $2, $3);`

    let values = [req.body.title, req.body.length, req.body.released];
    pool.query(queryText, values)
        .then((result) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })

});