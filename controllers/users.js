/**
 * This file is for controlling the USERS databases by queries
 * 'POST', 'GET, 'PATCH', 'DELETE'
 */

const { QueryTypes } = require('sequelize'); // For getting queries.
const jwt = require('jsonwebtoken'); // For processing token.
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

const verifyUser = async (req, res, next) => {
    try {
        // Get userName and password from req.body
        const userData = {
            userName: req.body.userName,
            password: req.body.password
        };

        console.log(userData);

        const user = await sequelize.query(
            `SELECT username, password FROM users WHERE username=? AND password=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [userData.userName,
                userData.password]
            });

        if (user.length) {
            req.userData = userData;
            next();
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (error) {
        console.log(error);
    }
}

const signJWTAndSendJSON = async (req, res, next) => {
    try {     
        // Get userName and password from req.body
        const userData = {
            userName: req.body.userName,
            password: req.body.password
        };

        console.log(userData);

        const user = await sequelize.query(
            `SELECT username, password FROM users WHERE username=? AND password=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [userData.userName,
                               userData.password]
            });

        if (user.length) {
            // Sign payload, secret key and expiration timer.
            jwt.sign({ userData }, privateinfo.getSecret(), {expiresIn: privateinfo.getExpiration()}, (error, token) => {
                res.json({
                    "data": [token]
                });
                console.log('--success--');
            });
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Method gets called on '/users'.
 * Returns all users in database.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await sequelize.query('SELECT *  FROM users', { type: QueryTypes.SELECT });

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

    console.log('Entered POST: create new user');

    // html should use <form></form> for this to work!
    try {

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password
        };

        console.log(req.body);

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
    catch (err) {
        console.log(err);
    }
};

//exports
module.exports = {
    getAllUsers: getAllUsers,
    postNewUser: postNewUser,
    signJWTAndSendJSON: signJWTAndSendJSON
};