/*jshint ignore:start*/

const userQueries = require('../utils/users-queries');
const bcrypt = require('bcryptjs');

const errorHandler = require('../utils/errors');

/**
 * First middleware of '/login'.
 *
 * Verifies username and password.
 * If true, inserts userhs credentials to req and calls next middleware.
 * else, sends 403 status (no access).
 */
const verifyUser = async (req, res, next) => {
    // console.log(chalk.magenta.bold('---verifyUser---'));
    try {
        /* Get userName and password from req.body */
        const userData = {
            userID: req.body.userName,
            password: req.body.password
        };

        /* Query for getting credentials from Database */
        const queryUser = await userQueries.getUserById(userData.userID);

        /* Correct login credentials */
        if (!queryUser) {
            // console.log(chalk.red.bold('Wrong login credentials'));
            // res.sendStatus(403);
            throw errorHandler('Wrong login credentials', 403);
        }

        const isEqual = await bcrypt.compare(userData.password, queryUser.password);
        if (!isEqual) {
            throw errorHandler('Wrong login credentials', 403);
        }

        req.userData = userData;

        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    verifyUser: verifyUser
};