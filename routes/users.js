const express = require('express');
const path = require('path');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'testHTML.html'));
});

router.get('/users', usersController.getAllUsers);

router.post('/users/:id', usersController.postNewUser);

module.exports = router;