const db = require('./database');

/**
 * Return an array with all the users in the database
 */
const getAllUsersFromDB = async () => {
    try {
        const users = await db.query('SELECT * FROM users');

        return users.rows;
    }
    catch (error) {
        throw error;
    }
};

/**
 * Inserts a user to the database
 */
const insertUserToDB = async (user) => {
    try {
        const results = await db.query(
            'INSERT INTO users (user_id, first_name, last_name, password, birth_date, type, position, picture, phone, last_login, mail, contacts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11, $12)',
            [
                user.id,
                user.firstName,
                user.lastName,
                user.password,
                null,
                user.type,
                null,
                null,
                null,
                null,
                user.email,
                user.contactUser
            ]
        );

        return results.rowCount;
    }
    catch (error) {
        throw error;
    }
};

/**
 * Find and return a user by user_id
 */
const getUserById = async (userId) => {
    try {
        const existingUser = await db.query(`SELECT * FROM users WHERE user_id=$1`, [userId]);
        // console.log(existingUser.rows[0]);
        return existingUser.rows[0];
    }
    catch (error) {
        throw error;
    }
};

/**
 * Return true if the user with the userId exists in the database, return false otherwise
 */
const isUserInDB = async (userId) => {
    try {
        const existingUser = await db.query(`SELECT * FROM users WHERE user_id=$1`, [userId]);
    
        return existingUser.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
};

/**
 * A query that's updating a specific user in database
 */
const updateUserInDB = async (user) => {
    try {
        const result = await db.query(
            'UPDATE users SET first_name = $1, last_name = $2, mail = $3, type = $4, contacts = $5 WHERE user_id = $6',
            [
                user.firstName,
                user.lastName,
                user.email,
                user.userType,
                user.contactUser,
                user.id
            ]
        );

        return result.rowCount;
    }
    catch (error) {
        throw(error);
    }
};

/**
 * A query that finds and delete a user from database by user_id,
 * and return true if the user has been deleted successfully,
 * false otherwise
 */
const deleteUserFromDB = async (userId) => {
    try{
        const result = await db.query(`DELETE FROM users WHERE user_id = $1`, [userId]);

        return result.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
}

/**
 * Inserts a login information about a user to the database
 */
const insertLoginInfoToDB = async (user) => {
    try {
        const result = await db.query('INSERT INTO "login" (user_id, token, time, is_valid) VALUES($1, $2, $3, $4)',
            [
                user.userId,
                user.token,
                user.time,
                user.isValid
            ]
        );
        
        return result.rowCount;
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsersFromDB: getAllUsersFromDB,
    insertUserToDB: insertUserToDB,
    getUserById: getUserById,
    isUserInDB: isUserInDB,
    updateUserInDB: updateUserInDB,
    deleteUserFromDB: deleteUserFromDB,
    insertLoginInfoToDB: insertLoginInfoToDB
};