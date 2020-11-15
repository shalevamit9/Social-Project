const express = require('express');
const authorization = require('../middleware/authorization');
const goodWordController = require('../controllers/good-word');

const router = express.Router();

// Get good word for a specific user
router.get('/goodWord', authorization.formatAndSetToken, authorization.verifyToken, goodWordController.getGoodWord);

// Create a good word
router.post('/goodWord/:id', authorization.formatAndSetToken, authorization.verifyToken, goodWordController.createGoodWord);

module.exports = router;