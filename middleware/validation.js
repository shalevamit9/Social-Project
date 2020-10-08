const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

/**
 * First middleware of '/login'.
 *
 * Verifies username and password.
 * If true, inserts userhs credentials to req and calls next middleware.
 * else, sends 403 status (no access).
 */
const verifyUser = async (req, res, next) => {
    try {
        /* Get userName and password from req.body */
        const userData = {
            userID: req.body.userID,
            password: req.body.password
        };

        /* Query for getting credentials from Database */
        const queryUser = await queries.getUserById(userData.userID);
        
        if (!queryUser) {
            throw errorHandler('Wrong login credentials', 403);
        }

        if (queryUser.password != userData.password) {
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