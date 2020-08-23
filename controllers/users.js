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
            /* Not sure what to send here */
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
    /* Not sure what to send here */
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
            /* Not sure what to send here */
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

    jwt.sign({ validatedUser }, process.env.ACCESS_TOKEN_SECRET, (error, token) => {

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
            ID: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            userType: req.body.userType,
            contactUser: req.body.contactUser
        };

        const UserExists = await isUserInDB(user.ID);

    /* User does not exists. Creating new user */
        if (!UserExists) { 

            console.log(chalk.green.bold('Creating new user'));
            const results = insertUserToDB(user);

            results[0] = user;
            res.json({
                data: results
            });
        }
        else {
            console.log(chalk.red.bold('User Already exists in databse:'));
            res.json({
                /* Not sure what to do here */
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
        `INSERT INTO users (ID ,firstName, lastName, email, password, userType, contactUser) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
            type: QueryTypes.INSERT,
            replacements: [
                user.ID,
                user.firstName,
                user.lastName,
                user.email,
                user.password,
                user.userType,
                contactUser
            ]
        });
    console.log(results);
    return results;
};

/**
 *  Pulls user from database.
 */
const pullUserFromDB = async (user_id) => {
    const existingUser = await sequelize.query(
        `SELECT user_id FROM User WHERE user_id=?`,
        {
            type: QueryTypes.SELECT,
            replacements: [user_id]
        });
    return existingUser;
}

/**
 * Checks if user exists in database.
 */
const isUserInDB = async (user_id) => {
    const existingUser = await pullUserFromDB(user_id);
    let result;

    if (existingUser.length === 0) {
        result = false;
    }
    else {
        result = true;
    }

    return result;
}

const updateUserInDB = async (req, res, next) => {
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userType: req.body.userType,
            contactUser: req.body.contactUser
        };

        const userID = req.params.id;
        const isUserExistsInDB = await isUserInDB(userID);
        if (isUserExistsInDB) {
            await sequelize.query(
                `UPDATE User SET first_name = ?, last_name = ?, email = ?, type, = ?, contactUser = ? WHERE user_id = ?`,
                {
                    type: QueryTypes.UPDATE,
                    replacements: [firstName,
                        lastName,
                        email,
                        userType,
                        contactUser,
                        userID]
                }
            );

            // Add id to object
            res.json([{
                id: user_id,
                ...user
            }]);
        }
    }
    catch (error) {
    /* Not sure what to send here */
        res.sendStatus(401);
        console.log(error);
    }    
}

const deleteUserFromDB = async (req, res, next) => {
    try {
        const userID = req.params.id;
        const isUserInDB = await isUserInDB(userID);
        let result = false;
    
        if (isUserInDB) {
           const queryResult = await sequelize.query(
                `DELETE FROM User WHERE user_id = ?`,
                {
                    type: QueryTypes.DELETE,
                    replacements: [userID]
                }
            );  
            
            if (queryResult.affectedRows > 0) {
                result = true;
            }            
        }        
        
        res.json({
            data: result
        });        
    }
    catch (error) {
    /* Not sure what to send here */
        res.sendStatus(401);
        console.log(error);
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    postNewUser: postNewUser,
    signJWTAndSendJSON: signJWTAndSendJSON,
    verifyUser: verifyUser,
    formatAndSetToken: formatAndSetToken,
    verifyToken: verifyToken,
    updateUserInDB: updateUserInDB,
    deleteUserFromDB: deleteUserFromDB
};