/*jshint ignore:start*/

const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

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

const createNewApplication = async (req, res, next) => {
    
    try {
        const newApplication = {
            receiverID: req.body.receiver,
            senderID: req.body.sender,
            subject: req.body.subject,
            content: req.body.content,
            time: req.time_and_date
        }

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

module.exports = {
    getApplication: getApplication,
    createNewApplication: createNewApplication
};