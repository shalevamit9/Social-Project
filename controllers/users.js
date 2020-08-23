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
const login = async (req, res, next) => {
    // console.log(chalk.green.bold('---signJWTAndSendJSON---'));

    // const validatedUser = req.userData;
    const userName = req.userData.userName;
    
    try {
        const token = jwt.sign({ userName: userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        
        if (!token) {
            throw errorHandler('Cannot generate token', 500);
        }

        const user = {
            userId: userName,
            token: token,
            time: new Date(Date.now()),
            isValid: true
        };
        const numberOfRowsInserted = await usersQueries.insertLoginInfoToDB(user);

        res.json({ token: [{ token: token }] });
    }
    catch (error) {
        next(error);
    }
};

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
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            type: req.body.userType,
            contactUser: req.body.contactUser,
            lastLogin: null
        };

        const existingUser = await usersQueries.getUserById(user.id);

        /* User already exists error */
        if (existingUser) {
            // console.log(chalk.red.bold('User Already exists in databse:'));
            // console.log(existingUser);
            // res.json({
            //     userAlreadyExists: true
            // });

            throw errorHandler('User already exists', 409);
        }
            
        /* User does not exists. Creating new user */
        // console.log(chalk.green.bold('Creating new user'));
        const hasedPassword = await bcrypt.hash(user.password, 8);
        user.password = hasedPassword;
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
    login: login,
    updateUser: updateUser,
    deleteUser: deleteUser
};