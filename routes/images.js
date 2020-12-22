const express = require('express');
const permissions = require('../middleware/permission');

/* Controller methods */
const imagesController = require('../controllers/images');
const authorization = require('../middleware/authorization');

/* For handling routes */
const router = express.Router();

/* Get all the image paths in DB */
router.get('/getAllImages',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    imagesController.getAllImages);

/* Get all image paths with a specific status */
router.get('/getImagesByStatus',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    imagesController.getImagesByStatus);

/* Insert a single or multiple images paths is status in DB and store the image in images folder */
router.post('/insertImage',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    imagesController.insertImages);

/* Delete an image from the DataBase and from images folder physically */
router.delete('/deleteImage',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    imagesController.deleteImage);

/* Update a single or multiple images status */
router.patch('/updateImageStatus',
    authorization.formatAndSetToken,
    authorization.verifyToken,
    permissions.isAdmin,
    imagesController.updateImageStatus);

module.exports = router;