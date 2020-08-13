// Requires
const express = require('express');
const usersRoutes = require('./routes/users');
const bodyParser = require('body-parser');

// Initialize server
const app = express();

// Parsing middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Getting routes
app.use(usersRoutes);

// Run
app.listen(3000, ()=> console.log('Server started on port 3000'))