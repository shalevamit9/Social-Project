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
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const chalk = require('chalk');

/* Importing the pool. */
// const sequelize = require('../utils/database');
const db = require('../utils/database');
const usersQueries = require('../utils/users-queries');
const errorHandler = require('../utils/errors');

/**
 * Method gets called on '/users'.
 * Returns all users in database in JSON format.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersQueries.getAllUsersFromDB();
        res.json({ users: users });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Second middleware of '/login'.
 * 
 * Gets validated login credentials from previous middleware.
 * Signs token, and sends it back in JSON format.
 */
const signJWTandSendToken = async (req, res, next) => {

    // const validatedUser = req.userData;
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
        await usersQueries.insertLoginInfoToDB(user);

        res.json({ token: [{ token: token }] });
    }
    catch (error) {
        next(error);
    }
};

const invalidateToken = async (req, res, next) => {
    try {
        const userID = req.userID;
        await usersQueries.updateColumn('login', 'is_valid', 'FALSE', userID);

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

/**
 * Method gets called on '/users/:id'. The id is given.
 * Creates new user and inserts the user to the database.
 */
const signup = async (req, res, next) => {
    // console.log(chalk.green.bold('Entered POST: create new user'));
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw errorHandler('Validation failed, entered data is incorrect.', 422);
        }

        const user = {
            ID: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            type: req.body.userType,
            contactUser: req.body.contactUser,
            lastLogin: null
        };

        const existingUser = await usersQueries.getUserById(user.ID);

        /* User already exists error */
        if (existingUser) {
            // console.log(chalk.red.bold('User Already exists in databse:'));
            // console.log(existingUser);
            // res.json({
            //     userAlreadyExists: true
            // });

            /* not sure what to return */
            throw errorHandler('User already exists', 409);
        }
            
        /* User does not exists. Creating new user */
        // console.log(chalk.green.bold('Creating new user'));
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
        const numberOfUsersInserted = await usersQueries.insertUserToDB(user);

        res.json({
            data: user
        });
    }
    catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = {
            id: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userType: req.body.userType,
            contactUser: req.body.contactUser
        };

        // const userId = req.params.id;
        const isUserExistsInDB = await usersQueries.isUserInDB(user.id);
        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        const numberOfUsersUpdated = await usersQueries.updateUserInDB(user);

        res.json([user]);
    }
    catch (error) {
        // res.sendStatus(401);
        // console.log(error);
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const isUserExistsInDB = await usersQueries.isUserInDB(userId);

        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        const isUserDeleted = await usersQueries.deleteUserFromDB(userId);

        if (!isUserDeleted) {
            throw errorHandler('Could not delete user', 500);
        }

        res.json({
            data: isUserDeleted
        });
    }
    catch (error) {
        // res.sendStatus(401);
        // console.log(error);
        next(error);
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    signup: signup,
    signJWTandSendToken: signJWTandSendToken,
    invalidateToken: invalidateToken,
    updateUser: updateUser,
    deleteUser: deleteUser
};