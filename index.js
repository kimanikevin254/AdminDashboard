const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const exphbs  = require('express-handlebars');

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded({extended: false}));

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

app.get('/cartracking', async(req, res) => {
    const sql = 'SELECT * FROM kefri.vehicles';
    const getcardata = connection.query(sql, (err, results) => {
            if (err) throw err;
            // console.log(results);
            res.send(results);
        });
})

app.post('/addCar', (req, res) => {
    console.log(req.body.Model) 
    console.log(req.body.Location)
    console.log(req.body.Capacity)
    console.log('Got body:', req.body);
    res.send(req.body);
});

// app.get('/addCar', async(req, res) => {
//     console.log('Got body:', req.body);
//     res.send("received");
//     // res.sendStatus(200);
//     // const sql = `INSERT INTO kefri.vehicles(id, model, location, capacity) VALUES (NULL, 'model1', 'model2', 14)`
//     //     const data = connection.query(sql, (err, results) => {
//     //         if (err) throw err;
//     //         res.send(results);
//     //     });
//     // console.log(req.body.Model) 
//     // console.log(req.body.Location)
//     // console.log(req.body.Capacity)
    
// })

app.get('/accidents', async(req, res) => {
    const sql = 'SELECT * FROM kefri.accidents INNER JOIN kefri.vehicles WHERE kefri.vehicles.id = kefri.accidents.id';
    const getcardata = connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.send(results);
        });
    
})

//Listen to port 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

//   app.use('/', require('./routes/routes'))


//Create routes
//route for getting car tracking info