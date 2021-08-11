const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const exphbs  = require('express-handlebars');

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//to be able to use fetch on node-js
const fetch = require('node-fetch');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '19860900',
    database: 'kefri'
});

//Connect to db
connection.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Mysql connected");
});

//Serving static files
app.use(express.static('public'));

//Creating routeModels

//Route to fetch car info from db
app.get('/cartracking', async(req, res) => {
    const sql = 'SELECT * FROM kefri.vehicles';
    const getcardata = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
})

//Route to add a car to db
app.post('/addCar', urlencodedParser, function (req, res) {
    const sql = `INSERT INTO kefri.vehicles(id, model, location, capacity) VALUES(NULL, "${ req.body.Model }", "${ req.body.Location }", ${ req.body.Capacity })`;
    const addCar = connection.query(sql, (err, results) => {
        if(err) throw err;
    })   
})

//Route to remove car from db
app.post('/removeCar', urlencodedParser, function (req, res) {
    const sql = `DELETE FROM kefri.vehicles WHERE id = ${req.body.id}`;
    const deleteCar = connection.query(sql, (err, results) => {
        if(err) throw err;
    console.log(req.body.id);
    })
})

// app.get('/accidents', async(req, res) => {
//     const sql = 'SELECT * FROM kefri.accidents INNER JOIN kefri.vehicles WHERE kefri.vehicles.id = kefri.accidents.id';
//     const getcardata = connection.query(sql, (err, results) => {
//             if (err) throw err;
//             console.log(results);
//             res.send(results);
//         });
    
// })

//Listen to port 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
