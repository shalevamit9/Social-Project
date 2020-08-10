/**
 * This file is for controlling the USERS databases by queries
 * 'POST', 'GET, 'PATCH', 'DELETE'
 */

const { QueryTypes } = require('sequelize');

// importing the pool connection
const sequelize = require('../utils/database');

/**
 * Method gets called on '/users'.
 * 
 * Returns all users in database.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await sequelize.query('SELECT *  FROM users', { type: QueryTypes.SELECT });

        // console.table(users);

        // returns JSON 
        res.send(users);
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Method gets called on '/users/:id'. The id is given.
 * 
 * Creates new user and inserts the user to the database.
 */
const postNewUser = async (req, res, next) => {

    console.log('entered post');
    // Given user's id.
    const id = req.params.id;

    console.log(id);

    // html should use <form></form> for this to work!
    try {
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        // const email = req.body.email;
        // const userType = req.body.userType;
        // const contactUser = req.body.contactUser;

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userType: req.body.userType,
            contactUser: req.body.contactUser,
            id: req.body.id
        };

        const [results, meta] = await sequelize.query(
            `INSERT INTO users (name, email, userType, contact) VALUES (?, ?, ?, ?)`,
            {
                type: QueryTypes.INSERT,
                replacements: [user.firstName + ' ' + user.lastName, user.email, user.userType, user.contactUser]
            });

        // const user = {
        //     name: 'kakikatan',
        //     email: 'test@test.com',
        //     userType: 'benzona',
        //     contactUser: true
        // };
        
        // const [results, metadata] = await sequelize.query(
        //     `INSERT INTO users (name, email, userType, contact) VALUES (?, ?, ?, ?)`,
        //     {
        //         type: QueryTypes.INSERT,
        //         replacements: [user.name, user.email, user.userType, user.contactUser]
        //     });
        
        results[0] = user;
        console.log(results);
        console.log('space');
        
        res.send(results);
        res.redirect('/');
        
        // const [results, meta] = await sequelize.query('INSERT INTO users (name, email, userType, contact) VALUES (?, ?, ?, ?)',
        //     [`${user.firstName} ${user.lastName}`, user.email, user.userType, user.contactUser], );
    }
    catch (err) {
        console.log(err);
    }
};

//exports
module.exports = {
    getAllUsers: getAllUsers,
    postNewUser: postNewUser
};