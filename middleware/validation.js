const userQueries = require('../utils/users-queries');
const bcrypt = require('bcryptjs');

const errorHandler = require('../utils/errors');

/**
 * First middleware of '/login'.
 *
 * Verifies username and password.
 * If true, inserts userhs credentials to req and calls next middleware.
 * else, sends 403 status (no access).
 */
const verifyUser = async (req, res, next) => {
    // console.log(chalk.magenta.bold('---verifyUser---'));

    try {
        /* Get userName and password from req.body */
        const userData = {
            userName: req.body.userName,
            password: req.body.password
        };

        /* Query for getting credentials from Database */
        // const user = await db.query(`SELECT * FROM users WHERE user_id=?`, [userData.userName]);
        const user = await userQueries.getUserById(userData.userName);

        // console.log(user);

        /* Correct login credentials */
        if (!user) {
            // console.log(chalk.red.bold('Wrong login credentials'));
            // res.sendStatus(403);
            throw errorHandler('Wrong login credentials', 403);
        }

        const isEqual = await bcrypt.compare(userData.password, user.password);
        if (!isEqual) {
            throw errorHandler('Wrong login credentials', 403);
        }

        req.userData = userData;
        // console.log(chalk.magenta.bold('---verifyUser complete. Calling next middlware---'));

        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    verifyUser: verifyUser
};