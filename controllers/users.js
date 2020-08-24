/*jshint ignore:start*/

/**
 * This file contains middlewares for routes in the website
 * and methods that access the database.
 */

require('dotenv').config();

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/* Importing the pool. */
// const db = require('../utils/database');
const usersQueries = require('../utils/users-queries');
const errorHandler = require('../utils/errors');

/**
 * Method gets called on '/users/:id'. The id is given.
 * Creates new user and inserts the user to the database.
 */
const signup = async (req, res, next) => {
    // console.log(chalk.green.bold('Entered POST: create new user'));
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     throw errorHandler('Validation failed, entered data is incorrect.', 422);
        // }

        const newUser = {
            ID: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            type: req.body.userType,
            contactUser: req.body.contactUser,
            lastLogin: null
        };

        const existingUser = await usersQueries.getUserById(newUser.ID);

        /* User already exists error */
        if (existingUser) {

            /* not sure what to return */
            throw errorHandler('User already exists', 409);
        }
            
        /* User does not exists. Creating new user */
        const hashedPassword = await bcrypt.hash(newUser.password, 8);
        newUser.password = hashedPassword;
        await usersQueries.insertUserToDB(newUser);

        res.json({
            data: newUser
        });
    }
    catch (error) {
        next(error);
    }
};

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

const updateUser = async (req, res, next) => {
    try {
        const user = {
            ID: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            userType: req.body.userType,
            contactUser: req.body.contactUser
        };

        // const userId = req.params.id;
        const isUserExistsInDB = await usersQueries.isUserInDB(user.ID);
        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        await usersQueries.updateUserInDB(user);

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
    signup: signup,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllUsers: getAllUsers
};