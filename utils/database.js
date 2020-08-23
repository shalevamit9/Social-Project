/*jshint ignore:start*/

/**
 * Need this to connect to our PostgreSQL databse.
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SERVER_INFORMATION);

module.exports = sequelize;