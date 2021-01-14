const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
// const basicAuth = require('./middleware/basic-auth');
// app.use(basicAuth);
var mysql = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});
app.use(function(req,res , next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Content-Type","application/json");
    next();
})
connection.connect();

app.get('/', (req, res) => {
    var usage = {
        "GET all restaurants": "http://localhost:3000/restaurants",
        "GET with Limit and Page": "http://localhost:3000/restaurants?limit=2&page=2",
        "GET with City": "http://localhost:3000/restaurants?city=bekasi",
        "GET with Cuisine Type": "http://localhost:3000/restaurants?cuisineType=padang",
        "GET with City": "http://localhost:3000/restaurants?city=Jak",
        "GET with ID": "http://localhost:3000/restaurants/RESTO001",
    }
    var response = {
        "message": "Welcome to Restaurants API",
        "List Usage GET:": usage,
        "Usage Delete:": "http://localhost:3000/restaurants/RESTO001",
        "Usage Update:": "http://localhost:3000/restaurants/RESTO001",
        "Usage Post:": "http://localhost:3000/restaurants",
    };
    res.status(200).send(response);
});
app.get('/city', (req, res) => {
    var errors = []
    var tempQuery = 'SELECT * FROM `cityMaster` ';
    connection.query(tempQuery,
        function (error, rows, fields) {
            if (error) {
                errors.push({
                    "field": "Query for select is error",
                    "message": error
                });
            } else {
                var response = {
                    "data": rows
                };
            }
            // checking error  
            if (errors.length > 0) {
                res.status(400).send({
                    errors
                });
            }
            else {
                res.status(200).send(response);
            }
        })
})
app.get('/cuisine', (req, res) => {
    var errors = []
    var tempQuery = 'SELECT * FROM `cuisineMaster`';
    connection.query(tempQuery,
        function (error, rows, fields) {
            if (error) {
                errors.push({
                    "field": "Query for select is error",
                    "message": error
                });
            } else {
                var response = {
                    "data": rows
                };
            }
            // checking error  
            if (errors.length > 0) {
                res.status(400).send({
                    errors
                });
            }
            else {
                res.status(200).send(response);
            }
        })
})
app.get('/restaurants', (req, res) => {
    var isKeyword = req.query.keyword
    var isCity = req.query.city
    var isCuisineType = req.query.cuisineType

    page = 1
    limit = 10
    var errors = []
    var tempQuery = 'SELECT * FROM restaurants WHERE isDeleted = false ';
    // Set LIMIT dan PAGE
    if (isKeyword != null) {
        tempQuery += " AND UPPER(name) LIKE UPPER('%" + isKeyword + "%') "
    }
    if (isCity != null) {
        tempQuery += " AND UPPER(city) LIKE UPPER('%" + isCity + "%') "
    }
    if (isCuisineType != null) {
        tempQuery += " AND UPPER(cuisineType) LIKE UPPER('%" + isCuisineType + "%') "
    }
    connection.query(tempQuery,
        function (error, rows, fields) {
            if (error) {
                errors.push({
                    "field": "Query for select is error",
                    "message": error
                });
            } else {
                results = rows;

                // Check PAGE
                if (req.query.page) {
                    if (isNaN(req.query.page)) { // isNaN ---> is not a number
                        errors.push({
                            "field": "page",
                            "message": "Page should be a number."
                        });
                    }
                    else if (parseInt(req.query.page) <= 0) {
                        errors.push({
                            "field": "page",
                            "message": "Page should be greater than zero."
                        });
                    }
                    else page = parseInt(req.query.page)
                }
                // Check Limit
                if (req.query.limit) {
                    if (isNaN(req.query.limit)) { // isNaN ---> is not a number
                        errors.push({
                            "field": "limit",
                            "message": "limit should be a number."
                        });
                    }
                    else if (parseInt(req.query.limit) <= 0) {
                        errors.push({
                            "field": "limit",
                            "message": "limit should be greater than zero."
                        });
                    }
                    else limit = parseInt(req.query.limit)
                }
                // check Total Page
                indexStart = (page - 1) * limit;
                indexEnd = page * limit;
                // filter data by limit and page
                var paginatedResult = results.filter((resto, index) => index >= indexStart && index < indexEnd);
                totalData = results.length
                totalPages = totalData / (indexEnd - indexStart)
                // checking response
                var response = {
                    "data": paginatedResult,
                    "meta": {
                        "page": page,
                        "limit": limit,
                        "totalPages": Math.ceil(totalPages),
                        "totalData": totalData
                    }
                };
            }
            // checking error  
            if (errors.length > 0) {
                res.status(400).send({
                    errors
                });
            }
            else {
                res.status(200).send(response);
            }
        })
})
app.delete('/restaurants/:id', (req, res) => {
    var dataId = req.params.id;
    var errors = [];
    connection.query('UPDATE restaurants SET isDeleted = true where id = ? AND isDeleted = false', [dataId],
        function (error, rows, fields) {
            if (error) {
                errors.push({
                    "field": "Select",
                    "message": "Query for select is error"
                });
            }
            if (rows.affectedRows < 1) {
                errors.push({
                    "field": "Select",
                    "message": "Restaurant with id " + dataId + " is not found."
                });
            }
            if (errors.length > 0) {
                res.status(404).send({
                    errors
                });
            }
            else {
                var response = {
                    "data": rows,
                    "message": "Delete restaurant success.",
                };
                res.status(200).send(response);
            }
        });
});
function checkingError(newresto) {
    var errors = []
    if (!newresto.id) {
        errors.push({
            "field": "id",
            "message": "Restaurant id is required."
        });
    }
    // jika newresto.name kosong / null / empty
    if (!newresto.name) {
        errors.push({
            "field": "name",
            "message": "Restaurant name is required."
        });
    }
    // jika newresto.cuisineType kosong / null / empty
    if (!newresto.cuisineType) {
        errors.push({
            "field": "cuisineType",
            "message": "Restaurant cuisineType is required."
        });
    }
    // jika newresto.city kosong / null / empty
    if (!newresto.city) {
        errors.push({
            "field": "city",
            "message": "Restaurant city is required."
        });
    }
    // jika newresto.rating kosong / null / empty
    if (!newresto.rating) {
        errors.push({
            "field": "rating",
            "message": "Restaurant rating is required."
        });
    }
    // jika newresto.rating should be a number
    if (isNaN(newresto.rating)) {
        errors.push({
            "field": "rating",
            "message": "Restaurant rating should be a number."
        });
    }
    // jika newresto.rating should be 1-5
    if (parseInt(newresto.rating) < 1 || parseInt(newresto.rating) > 5) {
        errors.push({
            "field": "rating",
            "message": "Restaurant rating should be between 1 to 5."
        });
    }
    return errors;
}
app.get('/restaurants/:id', (req, res) => {
    var dataId = req.params.id;
    var errors = []
    connection.query('SELECT * FROM restaurants where id = ? AND isDeleted = false', [dataId],
        function (error, rows, fields) {
            if (error) {
                errors.push({
                    "field": "Select",
                    "message": "Query for select is error"
                });
            } else {
                if (rows.length <= 0) {
                    errors.push({
                        "field": "id",
                        "message": "Restaurant with id " + dataId + " is not found."
                    });
                }
            }
            if (errors.length > 0) {
                res.status(404).send({
                    errors
                });
            }
            else {
                res.status(200).send(rows[0]);
            }
        });

});
app.post('/restaurants', (req, res) => {
    var newresto = req.body;
    // jika newresto.id kosong / null / empty
    // checking error
    var errors = checkingError(newresto);

    if (errors.length > 0) {
        res.status(400).send({
            errors
        });
    }
    else {
        connection.query('INSERT INTO restaurants' +
            ' VALUES (?,?,?,?,?,false)',
            [
                newresto.id,
                newresto.name,
                newresto.cuisineType,
                newresto.city,
                newresto.rating

            ],
            function (error, rows, fields) {
                if (error) {
                    errors.push({
                        "field": "Adding Data",
                        "message": error
                    });
                    res.status(400).send({
                        errors
                    });
                } else {
                    var response = {
                        "data": newresto,
                        "message": "New Restaurant succesfully added to the list.",
                    };
                    res.status(201).send(response);
                }
            })
    }
});
app.put('/restaurants/:id', (req, res) => {
    var updateresto = req.body;

    var dataForUpdate = {
        "id": req.params.id,
        "name": updateresto.name,
        "cuisineType": updateresto.cuisineType,
        "city": updateresto.city,
        "rating": updateresto.rating
    }
    var errors = checkingError(dataForUpdate)
    // jika updateresto.id kosong / null / empty
    if (errors.length > 0) {
        res.status(400).send({
            errors
        });
    }
    else {
        connection.query('UPDATE restaurants SET' +
            ' name =?, city= ? , cuisineType=?, rating=? WHERE id = ?',
            [
                updateresto.name,
                updateresto.city,
                updateresto.cuisineType,
                updateresto.rating,
                req.params.id
            ],
            function (error, rows, fields) {
                if (error) {
                    errors.push({
                        "field": "Update Data",
                        "message": error
                    });
                    res.status(400).send({
                        errors
                    });
                } else {
                    if (rows.affectedRows < 1) {
                        errors.push({
                            "field": "Select",
                            "message": "Restaurant with id " + dataId + " is not found."
                        });
                        res.status(400).send({
                            errors
                        });
                    } else {
                        var response = {
                            "data": dataForUpdate,
                            "message": "Update restaurant success.",
                        };
                        res.status(200).send(response);
                    }
                }
            })
    }
});

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
)