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

        const existingUserById = await queries.getUserById(newUser.ID);
        const existingUserByEmail = await queries.getUserByEmail(newUser.email);

        /* User already exists error */
        if (existingUserById) {
            throw errorHandler('User already exists', 409);
        }
        else if (existingUserByEmail) {
            throw errorHandler('Email already exists', 409);
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
            birthday: fetchedUser.birth_date,
            phone: fetchedUser.phone
        };

        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};

const getSpecificUser = async (req, res, next) => {
    try {
        const fetchedUser = await queries.getUserById(req.params.id);

        const user = {
            firstName: fetchedUser.first_name,
            lastName: fetchedUser.last_name,
            email: fetchedUser.email,
            userType: fetchedUser.type,
            contactUser: fetchedUser.contacts,
            birthday: fetchedUser.birth_date,
            phoneNumber: fetchedUser.phone
        };

        res.status(200).json([user]);
    }
    catch (error) {
        next(error);
    }
};

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

const changePassword = async (req, res, next) => {
    try {
        const user = await queries.getUserById(req.params.id);
        const newPassword = req.body.password;
        
        // Check new password is different than last 3 passwords
        const comparisonRows = await queries.getAmountOfPasswordsEqualToNewPassword(user.user_id, newPassword);
        const isPasswordDifferentThanLastThreePasswords = comparisonRows.length === 0;
        
        if (isPasswordDifferentThanLastThreePasswords) {
            // Set is_active of old password to false
            await queries.invalidateOldPassword(user.serial_id);
            
            // Insert new row to user_credentials with is_active = true
            user.ID = user.user_id;
            user.password = newPassword;
            await queries.insertUserCredentialsToDB(user);

            // Check if there are more than 3 last passwords
            const AmountOfPasswordsForUser = await queries.getAmountOfPasswordsForUser(user.user_id);
            
            // If true, delete the row of the oldest one
            if (AmountOfPasswordsForUser > 3) {
                await queries.deleteOldestPassword(user.user_id);
            }

            res.status(201).json(true);
        }
        else {
            // Execute if the passwords do match
            res.status(400).json(false);
        }
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
    getSpecificUser: getSpecificUser,
    getDaysSinceLastPasswordChange: getDaysSinceLastPasswordChange,
    matchBirthday: matchBirthday,
    changePassword: changePassword
};