/*jshint ignore:start*/

const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

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
            throw errorHandler('Failed to insert application', 500);
        }

        res.status(201);
        res.json({ data: true });
    }
    catch (error){
        next(error);
    }

}

module.exports = {
    createNewApplication: createNewApplication
};