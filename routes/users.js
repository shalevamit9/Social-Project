/*jshint ignore:start*/

const express = require('express'); 
const path = require('path'); 

/* Controller methods */
const usersController = require('../controllers/users');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routing */
const router = express.Router();

/** Returns JSON of all users
 * Creates new user --> sign up
 */
router.get('/users', authorization.formatAndSetToken, authorization.verifyToken, usersController.getAllUsers);

/* Create new user */
router.post('/users', usersController.signup);

/**
 * 1. Verify user
 * 2. Sign token
 * 3. send token back as jsons
 */
router.post('/login', validation.verifyUser, authorization.signJWTandSendToken);

router.post('/logout', authorization.formatAndSetToken, authorization.verifyToken, authorization.invalidateToken);

/* Update User in DB */
router.patch('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.updateUser);

/* Delete User from DB */
router.delete('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.deleteUser);

module.exports = router;