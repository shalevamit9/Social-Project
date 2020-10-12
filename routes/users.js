const express = require('express'); 

/* Controller methods */
const usersController = require('../controllers/users');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routes */
const router = express.Router();

/** Returns JSON of all users
 * Creates new user --> sign up
 */
router.get('/users', authorization.formatAndSetToken, authorization.verifyToken, usersController.getAllUsers);

router.get('/user', authorization.formatAndSetToken, authorization.verifyToken, usersController.getUser)

/* Creates new user */
router.post('/users', usersController.createNewUser);

/**
 * User credentials are verified. If credentials are valid,
 * a token is signed and sent. Else, sends a 403.
 */
router.post('/loginManager/login', validation.verifyUser, authorization.signJWTandSendToken);

router.get('/loginManager/passwordExceeded', validation.verifyUser, usersController.getDaysSinceLastPasswordChange);

/**
 * Log out procedure. User's token is invalidated.
 */
router.post('/logout', authorization.formatAndSetToken, authorization.verifyToken, authorization.invalidateToken);

/* Updates User in DB */
router.patch('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.updateUser);

/* Deletes User from DB */
router.delete('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.deleteUser);

module.exports = router;