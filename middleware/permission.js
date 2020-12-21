const errorHandler = require('../utils/errors');

const isAdmin = (req, res, next) => {
    try {
        if (!(req.userType === process.env.USER_TYPE_ADMIN)) {

            throw errorHandler('Permission not granted', 401);
        }

        next();
    }
    catch (error) {
        next(error);
    }
};

const isChairpersonOrAdmin = (req, res, next) => {
    try {
        if (!(req.userType === process.env.USER_TYPE_ADMIN
            || req.userType === process.env.USER_TYPE_CHAIRPERSON)) {
            
            throw errorHandler('Permission not granted', 401);
        }

        next();
    }
    catch (error) {
        next(error);
    }
};

const isCommitteeOrChairpersonOrAdmin = (req, res, next) => {
    try {
        if (!(req.userType === process.env.USER_TYPE_ADMIN
            || req.userType === process.env.USER_TYPE_CHAIRPERSON
            || req.userType === process.env.USER_TYPE_COMMITTEE)) {
            
            throw errorHandler('Permission not granted', 401);
        }

        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    isAdmin,
    isChairpersonOrAdmin,
    isCommitteeOrChairpersonOrAdmin
};