const express = require('express');
const authorization = require('../middleware/authorization');
const goodWordController = require('../controllers/good-word');
const permissions = require('../middleware/permission');

const router = express.Router();

// Get good word for a specific user
router.get('/goodWord',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    goodWordController.getGoodWords);

// Create a good word
router.post('/goodWord',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    goodWordController.createGoodWord);

// Update a good word
router.patch('/goodWord',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    goodWordController.updateGoodWord);

module.exports = router;