const express = require('express'); 
const path = require('path'); 

// Controller methods
const usersController = require('../controllers/users');

// For handling routing
const router = express.Router();

// Landing page
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'testHTML.html'));
});

// Returns JSON of all users
router.get('/users', usersController.getAllUsers);

// Create new user
router.post('/users/:id', usersController.postNewUser);

/**
 * 1. Verify user
 * 2. Sign token
 * 3. send token back as json
 */
router.post('/login', usersController.verifyUser, usersController.signJWTAndSendJSON);

module.exports = router;