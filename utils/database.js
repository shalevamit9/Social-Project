/**
 * Need this to connect to our PostgreSQL databse.
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:admin@127.0.0.1:5432/myDB');

module.exports = sequelize;