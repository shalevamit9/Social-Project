/*jshint ignore:start*/

const express = require('express'); 
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');
const inboxController = require('../controllers/inbox');

const router = express.Router();

router.get('/inbox/:id', authorization.formatAndSetToken, authorization.verifyToken, inboxController.getApplication);
router.post('/inbox', authorization.formatAndSetToken, authorization.verifyToken, inboxController.createNewApplication);

module.exports = router;