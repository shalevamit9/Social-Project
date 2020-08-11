const express = require('express'); 
const path = require('path'); 

// Controller methods.
const usersController = require('../controllers/users');

// For handling routing
const router = express.Router();

// Landing page.
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'testHTML.html'));
});

// returns JSON of all users.
router.get('/users', usersController.getAllUsers);

// Create new user.
router.post('/users/:id', usersController.postNewUser);

/**
 * 1. Sign token.
 * 2. Send token.
 */
router.post('/login', usersController.signJWTandSendJSON);

module.exports = router;