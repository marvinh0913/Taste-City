// App.js

/*
    SETUP
*/

// Express
var express = require('express');   // We are using the express library for the web server
var app = express(); 
app.use(express.json())
app.use(express.urlencoded({extended: true}))


PORT = 57891;                                  // Set a port number at the top so it's easy to change in the future

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector');

// Static Files
app.use(express.static('public'));  


/*
    ROUTES
*/

// GET ROUTES

app.get('/index', function(req, res) {
    res.render('index'); 
});

app.get('/users', function(req, res) {
    let query = "SELECT * FROM Users;";
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).send("Database error");
        } else {
            res.render('users', { data: rows });
        }
    });
});

app.get('/my_collection', function(req, res) {
    let query = "SELECT * FROM Restaurants;";
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).send("Database error");
        } else {
            res.render('my_collection', { data: rows });
        }
    });
});


// POST ROUTES

app.post('/add-user-ajax', function(req, res) {
    let data = req.body;

    // Capture NULL values 
    let username = data['username'] || 'NULL';
    let user_email = data['user_email'] || 'NULL';
    let password = data['password'] || 'NULL';
    let date_joined = data['date_joined'] || 'NULL';

    // Create the query and run it on the database
    let query = `INSERT INTO Users (username, user_email, password, date_joined) VALUES ('${username}', '${user_email}', '${password}', '${date_joined}')`;
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/users'); 
        }
    });
});

app.post('/add-restaurant-ajax', function(req, res) {
    let data = req.body;

    // Capture NULL values
    let user_id = data['user_id'] || 'NULL';
    let name = data['name'] || 'NULL';
    let location = data['location'] || 'NULL';
    let cuisine_type = data['cuisine_type'] || 'NULL';
    let rating = data['rating'] ? parseFloat(data['rating']) : 'NULL';
    let review = data['review'] || 'NULL';

    // Create the query and run it on the database
    let query = `INSERT INTO Restaurants (user_id, name, location, cuisine_type, rating, review) VALUES (${user_id}, '${name}', '${location}', '${cuisine_type}', ${rating}, '${review}')`;
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/my_collection'); 
        }
    });
});

app.post('/fetch-restaurants', async function(req, res) {
    console.log("Message accepted, fetching restaurant data from database");

    let query = "SELECT * FROM Restaurants;"; 

    db.pool.query(query, async function(error, rows, fields) {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send("Error retrieving restaurants");
        }

        console.log(`Retrieved ${rows.length} restaurants. Sending data to sorting microservice.`);

        try {
            const response = await fetch('http://localhost:5252/sort-data', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_data: rows, ...req.body })
            });

            const data = await response.json();
            console.log("Sorting completed. Sending sorted data to the server.");

            res.json(data);
        } catch (error) {
            console.error("Sorting microservice error:", error);
            res.status(500).send("Error sorting restaurants");
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});