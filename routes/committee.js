/*jshint ignore:start*/

const express = require('express');
// const { body } = require('express-validator');

/* Controller methods */
const committeeController = require('../controllers/committee');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routing */
const router = express.Router();

/** 
* Returns all charimen of all committees
*/
router.get('/committeeParticipants', authorization.formatAndSetToken, authorization.verifyToken, committeeController.getAllCommitteeParticipants);
router.post('/committees', authorization.formatAndSetToken, authorization.verifyToken, committeeController.createNewParticipant);
router.patch('/committees/:committeeName', authorization.formatAndSetToken, authorization.verifyToken, committeeController.updateCommitteeParticipantRole);
router.delete('/committees/:committeeName', authorization.formatAndSetToken, authorization.verifyToken, committeeController.deleteCommitteeParticipant);

module.exports = router;