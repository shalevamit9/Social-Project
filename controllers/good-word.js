const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');

// Function that gets all the good words for a specific user
const getGoodWord = async (req, res, next) => {
    const receiverID = parseInt(req.body.id);

    try {
        const goodWords = await queries.getUserGoodWords(receiverID);

        res.status(200).json(goodWords);
    }
    catch (error) {
        next(error)
    }
};

// Function that creates a good word with initial state = null
const createGoodWord = async (req, res, next) => {
    const goodWord = {
        receiverID: req.body.receiver_id,
        senderID: req.body.sender_id,
        committeeName: req.body.committee_name,
        content: req.body.content
    };
    
    try {
        await queries.insertGoodWord(goodWord);
        const lastGoodWord = await queries.getLastRowOfTable('good_feedback', 'serial_id');

        res.status(201).json(lastGoodWord);
    }
    catch(error) {
        next(error);
    }
};

const updateGoodWord = async (req, res, next) => {
    const goodWordData = {
        serialNumber: req.body.serial_number,
        state: req.body.status
    };

    try {
        const isUpdated = await queries.updateGoodWordInDB(goodWordData);

        if (isUpdated) {
            res.status(201).json(true);
        }
        else {
            res.status(400).json(false);
        }
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getGoodWord: getGoodWord,
    createGoodWord: createGoodWord,
    updateGoodWord: updateGoodWord
};