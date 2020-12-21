const express = require('express'); 

/* Controller methods */
const usersController = require('../controllers/users');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');
const permissions = require('../middleware/permission');

/* For handling routes */
const router = express.Router();

/** Returns JSON of all users
 * Creates new user --> sign up
 */
router.get('/users', authorization.formatAndSetToken, authorization.verifyToken, permissions.isAdmin, usersController.getAllUsers);

router.get('/user', authorization.formatAndSetToken, authorization.verifyToken, usersController.getUser);

// Get a specific user
router.get('/user/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.getSpecificUser);

/* Creates new user */
router.post('/users', authorization.formatAndSetToken, authorization.verifyToken, permissions.isAdmin, usersController.createNewUser);

/**
 * User credentials are verified. If credentials are valid,
 * a token is signed and sent. Else, sends a 403.
 */                                          // TODO add 180 days password reset
router.post('/loginManager/login', validation.verifyUser, authorization.signJWTandSendToken);

router.get('/loginManager/passwordExceeded', validation.verifyUser, usersController.getDaysSinceLastPasswordChange);

/**
 * Log out procedure. User's token is invalidated.
 */
router.post('/logout', authorization.formatAndSetToken, authorization.verifyToken, authorization.invalidateToken);

/* Updates User in DB */
router.patch('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.updateUser);

/* Deletes User from DB */
router.delete('/users/:id', authorization.formatAndSetToken, authorization.verifyToken, permissions.isAdmin, usersController.deleteUser);

/* Returns array of users with birthday matching given date. */
router.get('/userBirthdays', authorization.formatAndSetToken, authorization.verifyToken, usersController.matchBirthday);

router.post('/changePassword/:id', authorization.formatAndSetToken, authorization.verifyToken, usersController.changePassword);

module.exports = router;