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
                    sender: application.sender_id,
                    committeeName: application.committee_name,
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
};

/**
 * This method creates a new application.
 * 
 * Retrieves the new application's information and stores it in the database.
 */
// TODO - not enough information about the data we receive from UI
const createNewApplication = async (req, res, next) => {
    try {
        const newApplication = {
            senderID: req.userID,
            committeeName: req.body.committeeName,
            priority: req.body.priority,
            type: req.body.type,
            subject: req.body.subject,
            content: req.body.content,
            fullName: req.body.full_name,
            phone: req.body.phone_number,
            email: req.body.email,
            time: new Date(Date.now())
        };
        
        const result = await queries.insertNewApplication(newApplication);
        if (!result) {
            throw errorHandler('Failed', 500);
        }

        const createdInbox = await queries.getLastRowOfTable('inbox', 'inbox_id');

        res.status(201);
        res.json({ inbox_id: createdInbox.inbox_id });
    }
    catch (error) {
        next(error);
    }
};

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

};

const getInboxesByCommitteeName = async (req, res, next) => {
    const committeeName = req.params.committeeName;
    
    try {
        const inboxesByCommitteeName = await queries.getInboxesByCommitteeNameFromDB(committeeName);

        res.status(200).json(inboxesByCommitteeName);
    }
    catch (error) {
        next(error);
    }
};

const getInboxesBySenderId = async (req, res, next) => {
    const senderID = req.params.senderId;

    try {
        const inboxesBySenderID = await queries.getInboxesBySenderIDFromDB(senderID);

        res.status(200).json(inboxesBySenderID);
    }
    catch (error) {
        next(error);
    }
};

const markAsSpam = async (req, res, next) => {
    const inboxID = req.body.inbox_id;

    try {
        const result = await queries.markAsSpamInDB(inboxID);

        if (result) {
            res.status(200).json(true);
        }
        else {
            res.status(401).json(false);
        }
    }
    catch (error) {
        next(error)
    }
};

const replyToInbox = async (req, res, next) => {
    try {
        const reply = {
            handlerID: req.userID,
            inboxID: req.body.inbox_id,
            content: req.body.content,
            time: new Date(Date.now())
        }

        const isInboxIDAlreadyExistsInReplyTable = await queries.getReplyByInboxID(reply.inboxID);
        if (isInboxIDAlreadyExistsInReplyTable) {
            throw errorHandler('Reply Already Exist', 401);
        }

        const result = await queries.createNewReply(reply);

        if (result) {
            res.status(200).json(true);
        }
        else {
            res.status(401).json(false);
        }
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getApplication,
    createNewApplication,
    getAllInboxesForUser,
    getInboxesByCommitteeName,
    getInboxesBySenderId,
    markAsSpam,
    replyToInbox
};