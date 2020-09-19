/*jshint ignore:start*/

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
            `INSERT INTO 
            users 
            (user_id, first_name, last_name, password, birth_date, type, position, picture, phone, last_login, mail, contacts) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11, $12)`,
            [
                user.ID,
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
const getUserById = async (userID) => {
    try {

        const result = await db.query(`SELECT * FROM users WHERE user_id=$1`, [userID]);

        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
};

/**
 * Returns true if the user with the userId exists in the database, return false otherwise
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
        const result = await db.query(
            'INSERT INTO "login" (user_id, token, time, is_valid) VALUES($1, $2, $3, $4)',
            [
                user.userID,
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

const getTokenValidation = async (token) => {
    try {
        const result = await db.query(`SELECT is_valid FROM where token=${token}`);

        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
};

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
const addRoom = async(link, userID, participants, time, title)=>{
    try{
        let res = await db.query(`INSERT INTO "xpertesy" (link, host_id, participants, value_date, title)
        VALUES ($1,$2,$3::text[],$4,$5)`, [link, userID, participants, time, title]);
        return res;
    } 
    catch(err){
        throw err;
    }
}


const showFutureRooms = async(token, hostName, title, datetime)=>{
    try{
        let user = await getUserByToken(token)
        my_query = `SELECT DISTINCT title, CONCAT(first_name,' ',last_name) AS host_name, participants, value_date, link FROM xpertesy as x JOIN users as u ON
                (u.user_id = x.host_id), unnest(participants) as participant  
                WHERE (host_id = ${user.user_id} OR  participant  LIKE '%${user.email}%')
                AND value_date >=  '${datetime}'`;
        my_query += hostName ? ` AND CONCAT(first_name,' ',last_name) = '${hostName}'` : ''
        my_query += title ? ` AND title = '${title}'` : ''
        my_query += ` ORDER BY value_date`
        
        let res = await db.query(my_query);                                                                             
          for (i = 0; i < res.rows.length; i++) { 
            res.rows[i].link = res.rows[i].link + user.first_name
            }
        return res.rows;
    } 
    catch(err){
        throw err;
    }
}

const showPastRooms = async(token, hostName, title, datetime)=>{
    try{
        
        let user = await getUserByToken(token)
        my_query = `SELECT DISTINCT title, CONCAT(first_name,' ',last_name) AS host_name, participants, value_date, link FROM xpertesy as x JOIN users as u ON
                (u.user_id = x.host_id), unnest(participants) as participant  
                WHERE (host_id = ${user.user_id} OR  participant  LIKE '%${user.email}%')
                AND value_date <=  '${datetime}'`
        my_query += hostName ? ` AND CONCAT(first_name,' ',last_name) = '${hostName}'` : ''
        my_query += title ? ` AND title = '${title}'` : ''
        my_query += ` ORDER BY value_date`
        
        let res = await db.query(my_query);                                                                             
          for (i = 0; i < res.rows.length; i++) { 
            res.rows[i].link = res.rows[i].link + user.first_name
            }
        return res.rows;
    } 
    catch(err){
        throw err;
    }
}


const showBetweenRooms = async(token, hostName, title, fromDate, toDate)=>{
    try{
        
        let user = await getUserByToken(token)
        my_query = `SELECT DISTINCT title, CONCAT(first_name,' ',last_name) AS host_name, participants, value_date, link FROM xpertesy as x JOIN users as u ON
                (u.user_id = x.host_id), unnest(participants) as participant  
                WHERE (host_id = ${user.user_id} OR  participant  LIKE '%${user.email}%')
                AND  value_date BETWEEN '${fromDate}' AND '${toDate}'`
        my_query += hostName ? ` AND CONCAT(first_name,' ',last_name) = '${hostName}'` : ''
        my_query += title ? ` AND title = '${title}'` : ''
        my_query += ` ORDER BY value_date`
        
        let res = await db.query(my_query);                                                                             
          for (i = 0; i < res.rows.length; i++) { 
            res.rows[i].link = res.rows[i].link + user.first_name
            }
        return res.rows;
    } 
    catch(err){
        throw err;
    }
}

// return user details by token number
const getUserByToken = async(token)=>{

    try{
        let res = await db.query(`SELECT * FROM "users" as u INNER JOIN "login" as l ON (u.user_id = l.user_id) where token = $1`, [token]);
        const user = {
            user_id: res.rows[0].user_id,
            first_name: res.rows[0].first_name,
            last_name: res.rows[0].last_name,
            email: res.rows[0].email
                    
        };
        return user;
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    getAllUsersFromDB: getAllUsersFromDB,
    insertUserToDB: insertUserToDB,
    getUserById: getUserById,
    isUserInDB: isUserInDB,
    updateUserInDB: updateUserInDB,
    deleteUserFromDB: deleteUserFromDB,
    insertLoginInfoToDB: insertLoginInfoToDB,
    updateColumn: updateColumn,
    getAllInfoFromTable: getAllInfoFromTable,
    getApplicationByID: getApplicationByID,
    insertNewApplication: insertNewApplication,
    getTokenValidation: getTokenValidation,
    insertNewCommitteeParticipant: insertNewCommitteeParticipant,
    updateCommitteeParticipantRoleDB: updateCommitteeParticipantRoleDB,
    deleteCommitteeParticipantDB: deleteCommitteeParticipantDB,
    getUserByToken: getUserByToken,
    addRoom: addRoom,
    showFutureRooms: showFutureRooms,
    showPastRooms: showPastRooms,
    showBetweenRooms: showBetweenRooms
};