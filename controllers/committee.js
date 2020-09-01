/*jshint ignore:start*/

const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

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

const createNewParticipant = async (req, res, next) => {
    try {
        const newParticipant = {
            ID: req.body.userID,
            committeeName: req.body.committeeName,
            role: req.body.role
        };

        await queries.insertNewCommitteeParticipant(newParticipant);

        const user = await queries.getUserById(newParticipant.ID);
        const committee = await queries.getCommitteeByName(newParticipant.committeeName);

        res.status(201).json({
            data: [
                {
                    user: user,
                    committee: committee,
                    committeePosition: newParticipant.role
                }
            ]
        });
    }
    catch (error) {
        next(error);
    }
}

const updateCommitteeParticipantRole = async (req, res, next) => {
    try {
        const participant = {
            ID: req.body.userID,
            committeeName: req.params.committeeName,
            role: req.body.role
        }

        await queries.updateCommitteeParticipantRoleDB(participant);
        const user = await queries.getUserById(participant.ID);
        const committee = await queries.getCommitteeByName(participant.committeeName);

        res.status(201).json({
            data: [
                {
                    user: user,
                    committee: committee,
                    committeePosition: participant.role
                }
            ]
        });
    }
    catch (error) {
        next(error);
    }
}

const deleteCommitteeParticipant = async (req, res, next) => {
    try {
        const participant = {
            ID: req.body.userID,
            committeeName: req.params.committeeName
        }

        const isDeletedSuccessfully = await queries.deleteCommitteeParticipantDB(participant);
        if (!isDeletedSuccessfully) {
            throw errorHandler('Could not delete participant', 500);
        }
        
        res.status(200).json({
            data: true
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCommitteeParticipants: getAllCommitteeParticipants,
    createNewParticipant: createNewParticipant,
    updateCommitteeParticipantRole: updateCommitteeParticipantRole,
    deleteCommitteeParticipant: deleteCommitteeParticipant
};