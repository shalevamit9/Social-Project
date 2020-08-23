/*jshint ignore:start*/

const express = require('express');
const { body } = require('express-validator');

/* Controller methods */
const committeeController = require('../controllers/committee');
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');

/* For handling routing */
const router = express.Router();

/* ***/
router.get('/committeeParticipants', authorization.formatAndSetToken, authorization.verifyToken, committeeController.getAllCommitteeParticipants);


module.exports = router;