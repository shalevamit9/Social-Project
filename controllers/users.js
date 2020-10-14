/**
 * This file contains middlewares for routes in the website.
 * Also, methods that access the database.
 */

require('dotenv').config();

/* Importing the pool. */
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
            type: req.body.type,
            contactUser: req.body.contactUser,
            birthDay: req.body.birthday,
            phone: req.body.phone
        };

        const existingUser = await queries.getUserById(newUser.ID);

        /* User already exists error */
        if (existingUser) {
            throw errorHandler('User already exists', 409);
        }
        
        /* User does not exists. Creating new user */
        await queries.insertUserToDB(newUser);
        await queries.insertUserCredentialsToDB(newUser);

        res.json([newUser]);
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
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};

/**
 * Return a specific user by an ID
 */
const getUser = async (req, res, next) => {
    try {
        const fetchedUser = await queries.getUserById(req.userID);

        const user = {
            id: fetchedUser.user_id,
            firstName: fetchedUser.first_name,
            lastName: fetchedUser.last_name,
            email: fetchedUser.email,
            userType: fetchedUser.type,
            contactUser: fetchedUser.contacts,
            birthday: fetchedUser.birth_date
        };

        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
}

/**
 * This method updates user's information in DB.
 * Returns user's inforamtion in JSON format.
 * If method fails, an error is emitted.
 */
const updateUser = async (req, res, next) => {
    try {
        const user = {
            ID: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            contactUser: req.body.contactUser,
            birthDay: req.body.birthday,
            phone: req.body.phone
        };

        const isUserExistsInDB = await queries.isUserInDB(user.ID);
        if (!isUserExistsInDB) {
            throw errorHandler('Could not find the user in database', 404);
        }

        await queries.updateUserInDB(user);

        res.json([user]);
    }
    catch (error) {
        next(error);
    }
}

/**
 * This method deletes a user from DB by id.
 * Returns true if success, else false.
 * If method fails, an error is emitted.
 */
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
        next(error);
    }
}

const getDaysSinceLastPasswordChange = async (req, res, next) => {
    try {
        const days = await queries.getDaysSinceLastPasswordChangeInDB(req.body.userID);

        res.json([days]);
    }
    catch (error) {
        next(error);
    }
}

const matchBirthday = async (req, res, next) => {
    try {
        const givenDate = req.body.date;

        /* parse date to format: dd//mm */
        const dateToCompare = givenDate.slice(0,-5);
        
        const users = await queries.getUsersByGivenBirthday(dateToCompare);

        res.json(users);
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllUsers: getAllUsers,
    getUser: getUser,
    getDaysSinceLastPasswordChange: getDaysSinceLastPasswordChange,
    matchBirthday: matchBirthday
};