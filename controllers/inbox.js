const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

/**
 * This method returns application by id in JSON format.
 */
const getApplication = async (req, res, next) => {
    try {
        const applicationID = req.params.id;
        const application = await queries.getApplicationByID(applicationID);

        res.status(200).json({
            data: [
                {
                    sender: application.sender,
                    receiver: application.receiver,
                    subject: application.subject,
                    content: application.content,
                    time_and_date: application.time
                }
            ]
        });
    }
    catch (error) {
        next(error);
    }
}

/**
 * This method creates a new application.
 * 
 * Retrieves the new application's information and stores it in the database.
 */
const createNewApplication = async (req, res, next) => {
    try {
        const newApplication = {
            receiverID: req.body.receiver,
            senderID: req.body.sender,
            subject: req.body.subject,
            content: req.body.content,
            time: new Date(Date.now())
        };
        
        const result = await queries.insertNewApplication(newApplication);
        if (!result) {
            throw errorHandler('Failed', 500);
        }

        res.status(201);
        res.json({ data: true });
    }
    catch (error){
        next(error);
    }
}

const getAllInboxesForUser = async (req, res, next) => {
    try {
        const userID = req.body.userID;
        const isSender = true;
        const inboxes = await queries.getAllApplicationsForUser(userID, isSender); // TODO get sender or receiver messages

        res.status(200).json(inboxes);
    }
    catch (error) {
        next(error);
    }

}

module.exports = {
    getApplication: getApplication,
    createNewApplication: createNewApplication,
    getAllInboxesForUser: getAllInboxesForUser
};