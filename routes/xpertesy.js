/*jshint ignore:start*/
const express = require('express'); 

/* Controller methods */
const authorization = require('../middleware/authorization');
const validation = require('../middleware/validation');
const xpertesyController = require('../controllers/xpertesy');

/* For handling routes */
const router = express.Router();

/* Creates new room */
router.post('/xpertesy/createroom', xpertesyController.createRoom);
// show rooms 
router.post('/xpertesy/showrooms', xpertesyController.showRooms)

module.exports = router;