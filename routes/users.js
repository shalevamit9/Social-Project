/*jshint ignore:start*/
const express = require('express');
const { body } = require('express-validator');

/* Controller methods */
const usersController = require('../controllers/users');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routing */
const router = express.Router();

/* Returns JSON of all users */
router.get('/users', authorization.formatAndSetToken, authorization.verifyToken, usersController.getAllUsers);

/* Create new user */
router.post('/users',
    [
        body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
    ],
    usersController.signup
);

/**
 * 1. Verify user
 * 2. Sign token
 * 3. send token back as json
 */
router.post('/login', validation.verifyUser, usersController.login);

/* Update User in DB */
router.patch('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.updateUser);

/* Delete User from DB */
router.delete('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.deleteUser);

module.exports = router;