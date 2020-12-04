require('dotenv').config();

/* Requires */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const imageParser = require('./utils/images-config');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const committeeRoutes = require('./routes/committee');
const inboxRoutes = require('./routes/inbox');
const newsRoutes = require('./routes/news');
const xpertesyRoutes = require('./routes/xpertesy');
const goodWordRoutes = require('./routes/good-word');
const imagesRoutes = require('./routes/images');

/* Initialize server */
const app = express();

/* Initialize cors */
app.use(cors());

/* Parsing middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(imageParser);

/* Getting routes */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(usersRoutes);
app.use(committeeRoutes);
app.use(inboxRoutes);
app.use(newsRoutes);
app.use(xpertesyRoutes);
app.use(goodWordRoutes);
app.use(imagesRoutes);

// middleware that send a message to the browser that the server is running
app.use('/', (req, res, next) => {
    res.send('Hello word');
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
});

/* Listening */
app.listen(process.env.PORT || 5010);