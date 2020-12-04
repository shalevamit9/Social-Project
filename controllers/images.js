const queries = require('../utils/queries');
const errorHandler = require('../utils/errors');
const fileHandler = require('../utils/file-util');

const getAllImages = async (req, res, next) => {
    try {
        const imagePaths = await queries.getAllImagesFromDB();

        res.status(200).json(imagePaths);
    }
    catch (error) {
        next(error);
    }
};

const getImagesByStatus = async (req, res, next) => {
    const status = req.body.status;

    try {
        const imagePaths = await queries.getAllImagesByStatusFromDB(status);

        res.status(200).json(imagePaths);
    }
    catch (error) {
        next(error);
    }
};

// Option 1 :
// UI need to send 2 coordinated arrays using FormData.
// The FormData will have one array of files and one array of status
// in a way that status[0] is the status of files[0]
// this can be accomplished by using FormData.append method
//
// Option 2 :
// UI need to send only images without status for each image
// and the status will be updated with the update URL /updateImageStatus
const insertImages = async (req, res, next) => {
    const filesInfo = req.files;
    const statuses = req.body.status;

    let imagesInfo;
    if (typeof statuses === 'string') {
        imagesInfo = [{
            path: filesInfo[0].path.replace('\\', '/'),
            status: statuses
        }];
    }
    else {
        imagesInfo = filesInfo.map((fileInfo, index) => {
            fileInfo.path = fileInfo.path.replace('\\', '/');
    
            return {
                path: fileInfo.path,
                status: statuses[index]
            };
        });
    }

    try {
        const isInserted = await queries.insertImagesToDB(imagesInfo);

        res.status(201).json(isInserted);
    }
    catch (error) {
        next(error);
    }
};

const deleteImage = async (req, res, next) => {
    const path = req.body.path;

    try {
        const isDeleted = await queries.deleteImageFromDB(path);

        if (!isDeleted) {
            throw errorHandler('Could not delete data', 500);
        }

        fileHandler.deleteFile(path);

        res.status(202).json(isDeleted);
    }
    catch (error) {
        next(error);
    }
};

const updateImageStatus = async (req, res, next) => {
    const imagesInfo = req.body.images;

    try {
        const isUpdated = await queries.updateImageStatusInDB(imagesInfo);

        if (!isUpdated) {
            throw errorHandler('Could not update data', 500);
        }

        res.status(200).json(isUpdated);
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getAllImages,
    getImagesByStatus,
    insertImages,
    deleteImage,
    updateImageStatus
};