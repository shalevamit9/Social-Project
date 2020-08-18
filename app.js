/*jshint ignore:start*/

/* Requires */
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');

/* Initialize server */
const app = express();

/* secure headers */
app.use(helmet());

/* Parsing middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Getting routes */
app.use(usersRoutes);

/* Run */
app.listen(3000, ()=> console.log('Server started on port 3000'))