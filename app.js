require('dotenv').config();

/* Requires */
const express = require('express');
const bodyParser = require('body-parser')
const usersRoutes = require('./routes/users');
const committeeRoutes = require('./routes/committee');
const inboxRoutes = require('./routes/inbox');
const xpertesyRoutes = require('./routes/xpertesy');
const newsRoutes = require('./routes/news');

/* Initialize server */
const app = express();

/* Parsing middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Getting routes */
app.use(usersRoutes);
app.use(committeeRoutes);
app.use(inboxRoutes);
app.use(xpertesyRoutes);
app.use(newsRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
});

/* Listening */
app.listen(process.env.PORT || 8080);