const express = require('express');
const bodyParser = require('body-parser');

const pg = require('pg'); // huge issue I ran into - npm install pg *******
//pg configuration: LOCAL ONLY - try to put on huroku - wont work
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



const songList = [{
        title: 'Take Five',
        length: '5:24',
        released: '1959-09-29'
    },
    {
        title: 'So What',
        length: '9:22',
        released: '1959-08-17'
    },
    {
        title: 'Black Gold',
        length: '5:17',
        released: '2012-02-01'
    }
];

app.get('/artist', (req, res) => { //didnt have a router set up so we changed from router.got to app.get

    const queryText = `SELECT * FROM "artist" ORDER BY "birthdate" DESC;`
    pool.query(queryText)
        .then((result) => {
            console.log(result.rows);
            res.send(result.rows);
        }).catch( (err) => {
            console.log(err);
            res.sendStatus(500);
        })



});//end router.get

app.post('/artist', (req, res) => {
    console.log('req.bod', req.body);
    
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
    console.log(`In /songs GET`);
    res.send(songList);
});

app.post('/song', (req, res) => {
    songList.push(req.body);
    res.sendStatus(201);
});