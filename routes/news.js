const express = require('express');
const authorization = require('../middleware/authorization');
const newsConroller = require('../controllers/news');

/* For handling routing */
const router = express.Router();

/* Handles inbox applications */
router.get('/news', authorization.formatAndSetToken, authorization.verifyToken, newsConroller.scrapeNews);

module.exports = router;