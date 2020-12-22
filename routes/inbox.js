const express = require('express'); 
const authorization = require('../middleware/authorization');
const inboxController = require('../controllers/inbox');
const permissions = require('../middleware/permission');

/* For handling routing */
const router = express.Router();

/* Handles inbox applications */
router.post('/inbox',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    inboxController.createNewApplication);

router.get('/inboxesUser',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    inboxController.getAllInboxesForUser);

router.post('/inbox/markAsSpam/',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isCommitteeOrChairpersonOrAdmin,
    inboxController.markAsSpam);

router.post('/inbox/response',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isCommitteeOrChairpersonOrAdmin,
    inboxController.replyToInbox);

router.get('/inbox/getByCommitteeName/:committeeName',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isCommitteeOrChairpersonOrAdmin,
    inboxController.getInboxesByCommitteeName);

router.get('/inbox/getBySenderId/:senderId',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    inboxController.getInboxesBySenderId);

router.get('/inbox/:id',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    inboxController.getApplication);


module.exports = router;