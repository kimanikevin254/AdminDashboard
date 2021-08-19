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
    password: '<YOUR-PASSWORD>',
    database: '<YOUR-DATABASE-NAME>'
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
    })
})

//Route to get accidents data
app.get('/accidentsTracking', async(req, res) => {
    const sql = 'SELECT * FROM kefri.accidents INNER JOIN kefri.vehicles WHERE kefri.accidents.vehicleId = kefri.vehicles.id';
    const getAccidentsdata = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    
})

//Route to add an accident to db
app.post('/addAccident', urlencodedParser, function (req, res) {
    const sql = `INSERT INTO kefri.accidents(description, location, vehicleId) VALUES("${ req.body.description }", "${ req.body.location }", ${ req.body.vehicleId })`;
    const addAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })   
})

//Route to remove an accident from db
app.post('/removeAccident', urlencodedParser, function (req, res) {
    const sql = `DELETE FROM kefri.accidents WHERE id = ${req.body.id}`;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to get rooms info
app.get('/roomsInfo', async(req, res) => {
    const sql = 'SELECT * FROM kefri.rooms';
    const getAccidentsdata = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    
})

//Route to update room info
app.post('/updateRoomInfo', urlencodedParser, function (req, res) {
    const sql = `UPDATE kefri.rooms SET roomStatus = '${req.body.roomStatus}' WHERE roomId = ${req.body.roomId}`;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to add a room
app.post('/addRoomInfo', urlencodedParser, function (req, res) {
    const sql = `INSERT INTO kefri.rooms(roomLocation, roomStatus) VALUES( '${req.body.roomLocation}', '${req.body.roomStatus}' )`;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to delete a room
app.post('/deleteRoomInfo', urlencodedParser, function (req, res) {
    const sql = `DELETE FROM kefri.rooms WHERE roomId = ${req.body.roomId} `;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to get offices info
app.get('/officeInfo', async(req, res) => {
    const sql = 'SELECT * FROM kefri.offices';
    const getAccidentsdata = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    
})

//Route to update office info
app.post('/updateOffice', urlencodedParser, function (req, res) {
    const sql = `UPDATE kefri.offices SET totalSpace = ${req.body.totalSpace}, spaceUsed = ${req.body.usedSpace} WHERE officeNo = ${req.body.officeId}`;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to add an office
app.post('/addOffice', urlencodedParser, function (req, res) {
    const sql = `INSERT INTO kefri.offices(totalSpace, spaceUsed) VALUES(${req.body.totalSpace}, ${req.body.usedSpace})`;
    const addOffice = connection.query(sql, (err, results) => {
        if(err) throw err;
        
    })
})

//Route to delete an office
app.post('/deleteOffice', urlencodedParser, function (req, res) {
    const sql = `DELETE FROM kefri.offices WHERE officeNo = ${req.body.deleteOfficeId}`;
    const deleteOffice = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to get staffHouses info
app.get('/getStaffHouses', async(req, res) => {
    const sql = 'SELECT * FROM kefri.staffHouses';
    const getstaffHouses = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    
})

//Route to update house info
app.post('/updateHouse', urlencodedParser, function (req, res) {
    const sql = `UPDATE kefri.staffHouses SET rate = ${req.body.rate}, status = '${req.body.status}', expectedVacationDate = '${req.body.expectedVacationDate}', houseDescription = '${req.body.description}' WHERE houseNo = ${req.body.houseId}`;
    const deleteAccident = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Route to add an office
app.post('/addHouse', urlencodedParser, function (req, res) {
    const sql = `INSERT INTO kefri.staffHouses(rate, status, expectedVacationDate, houseDescription) VALUES(${req.body.rate}, status = '${req.body.status}', expectedVacationDate = '${req.body.expectedVacationDate}', houseDescription = '${req.body.description}')`;
    const addOffice = connection.query(sql, (err, results) => {
        if(err) throw err;
        
    })
})

//Route to delete an office
app.post('/deleteHouse', urlencodedParser, function (req, res) {
    const sql = `DELETE FROM kefri.staffHouses WHERE houseNo = ${req.body.deleteHouseId}`;
    const deleteOffice = connection.query(sql, (err, results) => {
        if(err) throw err;
    })
})

//Listen to port 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
