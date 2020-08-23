/*jshint ignore:start*/

const usersQueries = require('../utils/users-queries');

const getAllCommitteeParticipants = async (req, res, next) => {
    try {
        const tableName = 'committee_participants';
        const result = await usersQueries.getAllInfoFromTable(tableName);

        res.status(200);
        res.json({ result: result });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCommitteeParticipants: getAllCommitteeParticipants
}