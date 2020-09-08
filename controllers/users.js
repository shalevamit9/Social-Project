/*jshint ignore:start*/

/**
 * This file contains middlewares for routes in the website
 * and methods that access the database.
 */

require('dotenv').config();

/* Importing the pool. */
// const db = require('../utils/database');
const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

/**
 * Method gets called on '/users/:id'. The id is given.
 * Creates new user and inserts the user to the database.
 */
const createNewUser = async (req, res, next) => {
    try {
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

        const existingUser = await queries.getUserById(newUser.ID);

        /* User already exists error */
        if (existingUser) {

            /* not sure what to return */
            throw errorHandler('User already exists', 409);
        }
            
        /* User does not exists. Creating new user */
        await queries.insertUserToDB(newUser);

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
 * If method fails, an error is emitted.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await queries.getAllUsersFromDB();
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
        const isUserExistsInDB = await queries.isUserInDB(user.ID);
        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        await queries.updateUserInDB(user);

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
        const isUserExistsInDB = await queries.isUserInDB(userId);

        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        const isUserDeleted = await queries.deleteUserFromDB(userId);

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
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllUsers: getAllUsers
};