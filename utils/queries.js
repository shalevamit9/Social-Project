/*jshint ignore:start*/

const db = require('./database');

/**
 * Return an array with all the users in the database
 */
const getAllUsersFromDB = async () => {
    try {
        const users = await db.query('SELECT * FROM user_details');

        return users.rows;
    }
    catch (error) {
        throw error;
    }
};

const insertUserCredentialsToDB = async (user) => {
    try {
        const result = await db.query(`INSERT INTO user_credentials VALUES($1, $2, $3)`, [user.ID, user.password, new Date(Date.now())]);
    }
    catch (error) {
        next(error);
    }
}

/**
 * Inserts a user to the database
 */
const insertUserToDB = async (user) => {
    try {
        const results = await db.query(
            `INSERT INTO 
            user_details 
            (user_id, first_name, last_name, birth_date, type, picture, phone, email, contacts) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                user.ID,
                user.firstName,
                user.lastName,
                user.birthDay,
                user.type,
                null,
                user.phone,
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
const getUserById = async (userID) => {
    try {
        const result = await db.query(`
        SELECT * FROM user_details
        INNER JOIN
        user_credentials
        USING(user_id)
        WHERE user_id=$1`, [userID]);
        
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
};

const getDaysSinceLastPasswordChangeInDB = async (userID) => {
    try {
        const days = await db.query(`
        SELECT DATE_PART('day', current_date - last_password_change) as "daysSinceLastPasswordChange"
        FROM user_credentials
        WHERE user_id=$1`
            , [userID]
        );

        return days.rows[0];
    }
    catch (error) {
        throw error;
    }
}

/**
 * Returns true if the user with the userId exists in the database, return false otherwise
 */
const isUserInDB = async (userId) => {
    try {
        const existingUser = await db.query(`SELECT * FROM user_details WHERE user_id=$1`, [userId]);
    
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
            'UPDATE user_details SET first_name = $1, last_name = $2, email = $3, type = $4, contacts = $5, birth_date = $6, phone = $7 WHERE user_id = $8',
            [                
                user.firstName,
                user.lastName,
                user.email,
                user.type,
                user.contactUser,
                user.birthDay,
                user.phone,
                user.ID
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
 * and returns true if the user has been deleted successfully,
 * false otherwise
 */
const deleteUserFromDB = async (userId) => {
    try {
        // need to add 'ON DELETE CASCADE' to the user_credentials table, and make the user_id to foreign key'
        const result = await db.query(`DELETE FROM user_details WHERE user_id = $1`, [userId]);

        return result.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
}

const updateColumn = async (table, column, data, userID) => {
    try {
        await db.query(`UPDATE ${table} SET ${column} = ${data} WHERE user_id = ${userID}`);
    }
    catch (error) {
        throw error;
    }
};

const getAllInfoFromTable = async (table) => {
    try {
        const result = await db.query(`SELECT * FROM ${table}`);

        return result.rows;
    }
    catch (error) {
        throw error;
    }
};

const getApplicationByID = async (applicationID) => {
    try {
        const result = await db.query(`SELECT * FROM inbox WHERE inbox_id = ${applicationID}`);

        return result.rows[0];
    }
    catch (error) { 
        throw error;
    }
}

const insertNewApplication = async (application) => {
    try {
        const result = await db.query(
            `INSERT INTO inbox 
            (receiver, sender, subject, content, time) 
            VALUES ($1,$2,$3,$4,$5)`,
            [
                application.receiverID,
                application.senderID,
                application.subject,
                application.content,
                application.time
            ]
        );
        
        return result.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
}


/* Untested function - need to test! */
const getAllCommitteeParticipantsDB = async (committeeName) => {
    try {
        const result = await db.query(`
        SELECT ud.user_id, first_name, last_name, ud.type, picture, birth_date, phone, email, contacts,		
		c.committee_name, committee_information, contact_information,
		cp.committee_position
        FROM user_details ud LEFT JOIN committee_participants cp USING(user_id) RIGHT JOIN committee c USING(committee_name)
        WHERE committee_name = $1
        `, [committeeName]);

        return result.rows;
    }
    catch (error) {
        throw error
    }
}

const insertNewCommitteeParticipant = async (participant) => {
    try {
        const result = await db.query(
            `INSERT INTO committee_participants VALUES 
            (${participant.ID}, ${participant.committeeName}, ${participant.role})`);
        
        return result.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
};

const updateCommitteeParticipantRoleDB = async (participant) => {
    try {
        await db.query(`
        UPDATE committee_participants 
        SET
        committee_position = ${participant.role} 
        WHERE
        user_id = ${participant.ID} AND committee_name = ${participant.committeeName}`);
    }
    catch (error) {
        throw error;
    }
}

const deleteCommitteeParticipantDB = async (participant) => {
    try {
        const result = await db.query(`
        DELETE FROM committee_participants
        WHERE
        user_id = ${participant.ID} 
        AND
        committee_name = ${participant.committeeName}`);

        return result.rowCount !== 0;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    getAllUsersFromDB: getAllUsersFromDB,
    insertUserCredentialsToDB: insertUserCredentialsToDB,
    insertUserToDB: insertUserToDB,
    getUserById: getUserById,
    getDaysSinceLastPasswordChangeInDB: getDaysSinceLastPasswordChangeInDB,
    isUserInDB: isUserInDB,
    updateUserInDB: updateUserInDB,
    deleteUserFromDB: deleteUserFromDB,
    updateColumn: updateColumn,
    getAllInfoFromTable: getAllInfoFromTable,
    getApplicationByID: getApplicationByID,
    insertNewApplication: insertNewApplication,
    getAllCommitteeParticipantsDB: getAllCommitteeParticipantsDB,
    insertNewCommitteeParticipant: insertNewCommitteeParticipant,
    updateCommitteeParticipantRoleDB: updateCommitteeParticipantRoleDB,
    deleteCommitteeParticipantDB: deleteCommitteeParticipantDB
};