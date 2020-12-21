/*jshint ignore:start*/
const express = require('express'); 
const permissions = require('../middleware/permission');

/* Controller methods */
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');
const xpertesyController = require('../controllers/xpertesy');

/* For handling routes */
const router = express.Router();

/* Creates new xpert esy room */
router.post('/xpertesy/createroom', authorization.formatAndSetToken, authorization.verifyToken, permissions.isCommitteeOrChairpersonOrAdmin, xpertesyController.createRoom);
// show xpertesy rooms 
router.post('/xpertesy/showrooms', authorization.formatAndSetToken, authorization.verifyToken, permissions.isCommitteeOrChairpersonOrAdmin, xpertesyController.showRooms);

module.exports = router;