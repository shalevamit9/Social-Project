/**
 * This file is for controlling the USERS databases by queries
 * 'POST', 'GET, 'PATCH', 'DELETE'
 */

const { QueryTypes } = require('sequelize'); // For getting queries.
const jwt = require('jsonwebtoken'); // For processing token.
// const path = require('path'); 

// Importing the pool.
const sequelize = require('../utils/database');

// // Set token.
// function FormatAndSetToken(req, res, next) {
//     // Get auth header value.
//     const bearerHeader = req.headers['authorization'];

//     // Check if bearer is undefined.
//     if (typeof bearerHeader !== 'undefined') {
//         // Split at the space
//         const bearer = bearerHeader.split(' ');

//         // Get token from array
//         const bearerToken = bearer;

//         //Set the Token
//         req.token = bearerToken

//         // Next middleware
//         next();
//     }
//     else {
        
//         // Unauthorized
//         res.sendStatus(401);
//     }
// }

const signJWTandSendJSON = async (req, res, next) => {
    try {     
        // Get userName and password from req.body
        const user = {
            userName: req.body.userName,
            password: req.body.password
        };

        console.log(user);

        // // Mock user instead of above 'user'
        // const user = {
        //     userName: 'testUser',
        //     password: 'password'
        // };       
        // console.log(user);

        if (user !== 'undefined') {
            // TODO: set secret generator.
            jwt.sign({user}, 'secretkey', (error, token) => {
                // TODO: Set Timer
                res.json({
                    "data":[token]
                })
                console.log('--success--')
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
            userType: req.body.userType,
            contactUser: req.body.contactUser
        };

        console.log(req.body);

        const [results, meta] = await sequelize.query(
            `INSERT INTO users (firstName, lastName, email, userType, contactUser) VALUES (?, ?, ?, ?, ?)`,
            {
                type: QueryTypes.INSERT,
                replacements: [user.firstName,
                               user.lastName,
                               user.email,
                               user.userType,
                               user.contactUser]
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
    signJWTandSendJSON: signJWTandSendJSON,
};