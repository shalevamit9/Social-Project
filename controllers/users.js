/**
 * This file is for controlling the USERS databases by queries
 * 'POST', 'GET, 'PATCH', 'DELETE'
 */

const { QueryTypes } = require('sequelize'); // For getting queries.
const jwt = require('jsonwebtoken'); // For processing token.
const chalk = require('chalk'); // For Highlighting console logs.
// const path = require('path'); 

// Importing the pool.
const sequelize = require('../utils/database');

const privateinfo = (function () {

    // Secret for signing JWT
    const secret = '42C20602620F2E33BAA6794FA1550D6F747C5526A8F89A7ED9C92D6718E62B64';

    // Miliseconds
    const Expiration = 10000;

    return {
        getSecret: () => {
            return secret;
        },
        getExpiration: () => {
            return Expiration;
        }
    }
})();

/**
 * Verifies token from user using 'jwt.verify'.
 * 
 * If user token is valid, grants access to requested webpage. 
 * Else, sends 403 status (access forbidden).
 * 
 * If 'jwt.verify' doesn't execute, catches error and logs it.
 */
const verifyToken = async (req, res, next) => {
    console.log(chalk.magenta.bold('---verifyToken---'));

    try {
        jwt.verify(req.token, privateinfo.getSecret(), (error, data) => {

            if (data) {
                console.log(chalk.green.bold('verifyToken complete. Calling next middleware.'))
                next();
            }
            else {
                console.log(chalk.red.bold('Error- ' + error))
                res.sendStatus(403);
            }
        })
    }
    catch (err) {
        console.log(chalk.red.bold('Something went wrong: ' + err))
    }
}

/**
 * Gets bearer token from req.headers (authorization section).
 * 
 * If token is defined, it is extracted, and applied to req.token.
 * Else, sends 403 status (access forbidden).
 */
const formatAndSetToken = async (req, res, next) => {
    console.log(chalk.magenta.bold('---formatAndSetToken---'))

    // Get auth header value.
    const bearerHeader = req.headers['authorization'];

    // Check if bearer is undefined.
    if (typeof bearerHeader !== 'undefined') {
        // Split on space
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const bearerToken = bearer[1];

        //Set the Token
        req.token = bearerToken

        // Next middleware
        console.log(chalk.green.bold('formatAndSetToken complete. Calling next middleware'))
        next();
    }
    else {

        // Unauthorized
        console.log(chalk.red.bold('forbidden'));
        res.sendStatus(403);
    }
}

/**
 * First middleware of '/login'.
 * 
 * Verifies username and password.
 * If true, inserts user's credentials to req and calls next middleware.
 * else, sends 403 status (no access).
 */
const verifyUser = async (req, res, next) => {
    console.log(chalk.magenta.bold('---verifyUser---'))

    try {
        // Get userName and password from req.body
        const userData = {
            userName: req.body.userName,
            password: req.body.password
        };

        // Query for getting credentials from Database
        const user = await sequelize.query(
            `SELECT username, password FROM users WHERE username=? AND password=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [userData.userName,
                               userData.password]
            });
        
        // Correct login credentials
        if (user.length) {
            req.userData = userData;
            console.log(chalk.magenta.bold('---verifyUser complete. Calling next middlware---'));

            next();
        }
        else {
            console.log(chalk.red.bold('Wrong login credentials'))
            res.sendStatus(403);
        }
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Second middleware of '/login'.
 * 
 * Gets validated login credentials from previous middleware.
 * Signs token, and sends it back in JSON format.
 */
const signJWTAndSendJSON = async (req, res, next) => {
    console.log(chalk.green.bold('---signJWTAndSendJSON---'));

    const validatedUser = req.userData;

    jwt.sign({ validatedUser }, privateinfo.getSecret(), { expiresIn: privateinfo.getExpiration() }, (error, token) => {
        res.json({
            "data": [token]
        });
        console.log(chalk.green.bold('---signJWTAndSendJSON complete. Token Sent Successfully!---'));
    });
}

/**
 * Method gets called on '/users'.
 * Returns all users in database in JSON format.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await sequelize.query('SELECT * FROM users', { type: QueryTypes.SELECT });

        // returns JSON 
        res.send(users);
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Method gets called on '/users/:id'. The id is given.
 * Creates new user and inserts the user to the database.
 */
const postNewUser = async (req, res, next) => {

    console.log(chalk.green('Entered POST: create new user'));

    // html should use <form></form> for this to work!
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password
        };

        // Check if username is taken
        const existingUser = await sequelize.query(
            `SELECT username FROM users WHERE username=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [user.userName]
            });

        // User does not exists. Creating new user
        if (!existingUser.length) { 
            const [results, meta] = await sequelize.query(
                `INSERT INTO users (firstName, lastName, email, userName, password) VALUES (?, ?, ?, ?, ?)`,
                {
                    type: QueryTypes.INSERT,
                    replacements: [user.firstName,
                    user.lastName,
                    user.email,
                    user.userName,
                    user.password]
                });
            results[0] = user;
            res.json({
                data: results
            })
        }
        else { // User exists. bassa
            res.json({
                userAlreadyExists: true
            })
        }
    }
    catch (err) {
        console.log(err);
    }
};

//exports
module.exports = {
    getAllUsers: getAllUsers,
    postNewUser: postNewUser,
    signJWTAndSendJSON: signJWTAndSendJSON,
    verifyUser: verifyUser,
    formatAndSetToken: formatAndSetToken,
    verifyToken: verifyToken
};