const jwt = require('jsonwebtoken');
const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');
const redis = require('../utils/redis');

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
        const token = jwt.sign({ userID: userID, userType: req.userData.type }, process.env.ACCESS_TOKEN_SECRET);
        
        if (!token) {
            throw errorHandler('Cannot generate token', 500);
        }

        res.json({ token: [{ token: token }] });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Verifies token from user using 'jwt.verify' and redis.
 * 
 * If user token is valid and not blacklisted, grants access to requested webpage. 
 * If token is invalid or blacklisted, the method emits 'Unauthorized' message
 * alongside a '401' status code.
 */
const verifyToken = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);

        redis.get(decodedToken.userID, function (error, data) {
            if (error) {
                next(error);
            }
            
            if (!decodedToken || data) {
                next(errorHandler('Unauthorized', 401));
            }

            req.userID = decodedToken.userID;
            req.userType = decodedToken.userType;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};

/**
 * This method invalidate the user's token.
 * 
 * The methods sets the user's ID and the token in a blacklist in redis.
 * The method responds with a 'Logout complete' message alongside a '200' status code.
 * If method fail, an error is emitted.
 */
const invalidateToken = async (req, res, next) => {
    try {
        const userID = req.userID;
        redis.setex(userID, process.env.REDIS_TTL, req.token, function (err, reply) {
            if (err) {
                next(err);
            }
            
            res.status(200);
            res.json({
                message: "Logout complete"
            });
        });
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