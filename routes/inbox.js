const express = require('express'); 
const authorization = require('../middleware/authorization');
const inboxController = require('../controllers/inbox');

/* For handling routing */
const router = express.Router();

/* Handles inbox applications */
router.get('/inbox/:id', authorization.formatAndSetToken, authorization.verifyToken, inboxController.getApplication);
router.post('/inbox', authorization.formatAndSetToken, authorization.verifyToken, inboxController.createNewApplication);
router.get('/inboxesUser', authorization.formatAndSetToken, authorization.verifyToken, inboxController.getAllInboxesForUser);

module.exports = router;