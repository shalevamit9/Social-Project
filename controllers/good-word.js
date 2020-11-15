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
    const receiverID = req.params.id;
    const content = req.body.input;
    
    try {
        await queries.insertGoodWord(req.userID, receiverID, content);

        res.status(201).json([{
            from: req.userID,
            input: content
        }]);
    }
    catch(error) {
        next(error);
    }
};

module.exports = {
    getGoodWord: getGoodWord,
    createGoodWord: createGoodWord
};