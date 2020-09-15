/**
 * This file contains methods that handle 'committee' related operations.
 */

const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

/**
 * This method gets all committee participants.
 * 
 * The method responds with the result in JSON format, alongside a '200' status code.
 * If query fails, error is emitted.
 */
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

/**
 * This methods creates a new committe participant.
 * 
 * The new participant's information is stored in the database.
 * This method responds with the participant's information, his/her new role in the committee,
 * the committee information, and a '201' status code. If the method fails, an error is emitted.
 */
const createNewParticipant = async (req, res, next) => {
    try {
        const newParticipant = {
            ID: req.body.userID,
            committeeName: req.body.committeeName,
            role: req.body.role
        };

        await queries.insertNewCommitteeParticipant(newParticipant);

        /* Get newParticipant's information and committee information.  */
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

/**
 * This method updates a committee participant role.
 * 
 * Retrieves the participant's ID and committee name alongside his/her new role in the committee.
 * The method responds with the participant's and the committee's information in JSON format alongside a '201' status code.
 * If the method fails, an error is emitted.
 */
const updateCommitteeParticipantRole = async (req, res, next) => {
    try {
        const participant = {
            ID: req.body.userID,
            committeeName: req.params.committeeName,
            role: req.body.role
        }

        await queries.updateCommitteeParticipantRoleDB(participant);

        /* Get newParticipant's information and committee information.  */
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

/**
 * This method deletes a participant from a committee.
 * 
 * Compares the participant's ID and committee name to the information stored in the database.
 * The method responds with a boolean in JSON format alongside a '200' status code. If the method fails, an error is emitted.
 */
const deleteCommitteeParticipant = async (req, res, next) => {
    try {
        const participant = {
            ID: req.body.userID,
            committeeName: req.params.committeeName
        }

        const isDeletedSuccessfully = await queries.deleteCommitteeParticipantDB(participant);

        /* Confirm participant is deleted successfully. */
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