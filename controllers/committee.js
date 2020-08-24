/*jshint ignore:start*/

const queries = require('../utils/queries');

const getAllCommitteeParticipants = async (req, res, next) => {
    try {
        const tableName = 'committee_participants';
        const result = await queries.getAllInfoFromTable(tableName);

        res.status(200);
        res.json({ result: result });
    }
    catch (error) {
        next(error);
    }
}

/* const createNewChairPerson = async (req, res, next) => {
    try {
        const newChairPerson = {
            ID: req.body.id,
            name: req.body.name,
            role: req.body.role,
            phone: req.body.phone,
            email: req.body.email
        }
    }
    catch{

    }
}
 */
module.exports = {
    getAllCommitteeParticipants: getAllCommitteeParticipants,
    createNewChairPerson: createNewChairPerson,
}