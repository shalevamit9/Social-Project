// Requires
const express = require('express');
// const sequelize = require('./utils/database');
const usersRoutes = require('./routes/users');
const bodyParser = require('body-parser');

// Initialize server.
const app = express();

// CHANGE

// Endpoints
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(usersRoutes);


// app.use('/', (req, res, next) => {
//    res.
// });

// run
app.listen(3000);