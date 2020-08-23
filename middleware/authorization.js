/*jshint ignore:start*/

const jwt = require('jsonwebtoken');

const errorHandler = require('../utils/errors');

/**
 * Gets bearer token from req.headers (authorization section).
 * 
 * If token is defined, it is extracted, and applied to req.token.
 * Else, sends 403 status (access forbidden).
 */
const formatAndSetToken = async (req, res, next) => {
    // console.log(chalk.magenta.bold('---formatAndSetToken---'));

    /* Get auth header value. */
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        /* Next middleware */
        // console.log(chalk.green.bold('formatAndSetToken complete. Calling next middleware'));
        next();
    }
    else {
        // console.log(chalk.red.bold('forbidden'));
        // res.sendStatus(403);
        next(errorHandler('Forbidden', 403));
    }
};

/**
 * Verifies token from user using 'jwt.verify'.
 * 
 * If user token is valid, grants access to requested webpage. 
 * Else, sends 401 status (Unauthorized).
 */
const verifyToken = async (req, res, next) => {
    // console.log(chalk.magenta.bold('---verifyToken---'));

    try {
        const decodedToken = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
        // need to verify !isvalid
        if (!decodedToken) {
            throw errorHandler('Unauthorized', 401);
        }
        
        req.userID = decodedToken.userID;
        next();
    }
    catch (err) {
        // console.log(chalk.red.bold('verifyToken failed: ' + err));
        next(err);
    }
};

module.exports = {
    verifyToken: verifyToken,
    formatAndSetToken: formatAndSetToken
};