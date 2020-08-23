require('dotenv').config();

// Requires
const express = require('express');
const db = require('./utils/database');
const usersRoutes = require('./routes/users');
const bodyParser = require('body-parser');

// Initialize server.
const app = express();

// Endpoints
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(usersRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
});

// Listening
app.listen(process.env.PORT || 3000);