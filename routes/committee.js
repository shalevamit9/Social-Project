const express = require('express');
const permissions = require('../middleware/permission');

/* Controller methods */
const committeeController = require('../controllers/committee');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routing */
const router = express.Router();

/* Handles all chairpersons and committees related actions */
router.get('/committeeParticipants/:committeeName',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isCommitteeOrChairpersonOrAdmin,
    committeeController.getAllCommitteeParticipants);

/* Create new participant */
router.post('/committees',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isChairpersonOrAdmin,
    committeeController.createNewParticipant);

router.patch('/committees/:committeeName',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    committeeController.updateCommitteeParticipantRole);

router.delete('/committees/:committeeName',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isChairpersonOrAdmin,
    committeeController.deleteCommitteeParticipant);

router.get('/committees',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    committeeController.getCommitteeNamesAndInfo);

/* Create new committee */
router.post('/committees/createCommitte',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    committeeController.createCommittee);

module.exports = router;