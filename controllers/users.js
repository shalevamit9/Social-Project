/*jshint ignore:start*/

/**
 * This file contains middlewares for routes in the website
 * and methods that access the database.
 */

/* Create secret by running in node:
   require('crypto').randomBytes(64).toString('hex') */
require('dotenv').config();

const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken'); 
const chalk = require('chalk');

/* Importing the pool. */
const sequelize = require('../utils/database');

/**
 * Verifies token from user using 'jwt.verify'.
 * 
 * If user token is valid, grants access to requested webpage. 
 * Else, sends 403 status (access forbidden).
 */
const verifyToken = async (req, res, next) => {
    console.log(chalk.magenta.bold('---verifyToken---'));

    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {

            if (data) {
                console.log(chalk.green.bold('verifyToken complete. Calling next middleware.'));
                next();
            }
            else {
                console.log(chalk.red.bold('Error- ' + error));
                res.sendStatus(403);
            }
        });
    }
    catch (err) {
        console.log(chalk.red.bold('verifyToken failed: ' + err));
    }
};

/**
 * Gets bearer token from req.headers (authorization section).
 * 
 * If token is defined, it is extracted, and applied to req.token.
 * Else, sends 403 status (access forbidden).
 */
const formatAndSetToken = async (req, res, next) => {
    console.log(chalk.magenta.bold('---formatAndSetToken---'));

    /* Get auth header value. */
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

    /* Next middleware */
        console.log(chalk.green.bold('formatAndSetToken complete. Calling next middleware'));
        next();
    }
    else {
        console.log(chalk.red.bold('forbidden'));
        res.sendStatus(403);
    }
};

/**
 * First middleware of '/login'.
 *
 * Verifies username and password.
 * If true, inserts userhs credentials to req and calls next middleware.
 * else, sends 403 status (no access).
 */
const verifyUser = async (req, res, next) => {
    console.log(chalk.magenta.bold('---verifyUser---'));

    try {
        /* Get userName and password from req.body */
        const userData = {
            userName: req.body.userName,
            password: req.body.password
        };

        /* Query for getting credentials from Database */
        const user = await sequelize.query(
            `SELECT username, password FROM users WHERE username=? AND password=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [userData.userName,
                userData.password]
            });
        
        /* Correct login credentials */
        if (user.length) {
            req.userData = userData;
            console.log(chalk.magenta.bold('---verifyUser complete. Calling next middlware---'));

            next();
        }
        else {
            console.log(chalk.red.bold('Wrong login credentials'));
            res.sendStatus(403);
        }
    }
    catch (error) {
        console.log(error);
    }
};

/**
 * Second middleware of '/login'.
 * 
 * Gets validated login credentials from previous middleware.
 * Signs token, and sends it back in JSON format.
 */
const signJWTAndSendJSON = async (req, res, next) => {
    console.log(chalk.green.bold('---signJWTAndSendJSON---'));

    const validatedUser = req.userData;

    jwt.sign({ validatedUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' }, (error, token) => {

        if (token) {
            res.json({'token': [token]});
            console.log(chalk.green.bold('---signJWTAndSendJSON complete. Token Sent Successfully!---'));
        }
        else {
            console.log('Error- ' + error);
        }

    });
};

/**
 * Method gets called on '/users'.
 * Returns all users in database in JSON format.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await sequelize.query('SELECT * FROM users', { type: QueryTypes.SELECT });

    /* returns JSON  */
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

    console.log(chalk.green.bold('Entered POST: create new user'));
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password
        };

        const existingUser = await userExistsInDB(user.userName);

    /* User does not exists. Creating new user */
        if (!existingUser.length) { 

            console.log(chalk.green.bold('Creating new user'));
            const results = insertUserToDB(user);

            results[0] = user;
            res.json({
                data: results
            });
        }
        else {
            console.log(chalk.red.bold('User Already exists in databse:'));
            console.log(existingUser);
            res.json({
                userAlreadyExists: true
            });
        }
    }
    catch (err) {
        console.log(err);
    }
};

const insertUserToDB = async (user) => {
    const [results, meta] = await sequelize.query(
        `INSERT INTO users (firstName, lastName, email, userName, password) VALUES (?, ?, ?, ?, ?)`,
        {
            type: QueryTypes.INSERT,
            replacements: [
                user.firstName,
                user.lastName,
                user.email,
                user.userName,
                user.password
            ]
        });
    console.log(results);
    return results;
};

/**
 * Checks if user exists in database.
 */
const userExistsInDB = async (userName) => {
    const existingUser = await sequelize.query(
        `SELECT username FROM users WHERE username=?`,
        {
            type: QueryTypes.SELECT,
            replacements: [userName]
        });
    return existingUser;
}

module.exports = {
    getAllUsers: getAllUsers,
    postNewUser: postNewUser,
    signJWTAndSendJSON: signJWTAndSendJSON,
    verifyUser: verifyUser,
    formatAndSetToken: formatAndSetToken,
    verifyToken: verifyToken
};