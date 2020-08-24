/*jshint ignore:start*/

const jwt = require('jsonwebtoken');
const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

/**
 * Gets bearer token from req.headers (authorization section).
 * 
 * If token is defined, it is extracted, and applied to req.token.
 * Else, sends 403 status (access forbidden).
 */
const formatAndSetToken = async (req, res, next) => {

    /* Get auth header value. */
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        /* Next middleware */
        next();
    }
    else {
        // res.sendStatus(403);
        next(errorHandler('Forbidden', 403));
    }
};

/**
 * Second middleware of '/login'.
 * 
 * Gets validated login credentials from previous middleware.
 * Signs token, and sends it back in JSON format.
 */
const signJWTandSendToken = async (req, res, next) => {

    const userID = req.userData.userID;

    try {
        const token = jwt.sign({ userID: userID }, process.env.ACCESS_TOKEN_SECRET);

        if (!token) {
            throw errorHandler('Cannot generate token', 500);
        }

        const user = {
            userID: userID,
            token: token,
            time: new Date(Date.now()),
            isValid: true
        };
        await queries.insertLoginInfoToDB(user);

        res.json({ token: [{ token: token }] });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Verifies token from user using 'jwt.verify'.
 * 
 * If user token is valid, grants access to requested webpage. 
 * Else, sends 401 status (Unauthorized).
 */
const verifyToken = async (req, res, next) => {

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
        next(err);
    }
};

const invalidateToken = async (req, res, next) => {
    try {
        const userID = req.userID;
        await queries.updateColumn('login', 'is_valid', 'FALSE', userID);

        res.status(200);
        res.json({
            message: "logout complete"
        })
        console.log(chalk.green.bold('FUCK KANZIE'));
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    verifyToken: verifyToken,
    formatAndSetToken: formatAndSetToken,
    invalidateToken: invalidateToken,
    signJWTandSendToken: signJWTandSendToken
};