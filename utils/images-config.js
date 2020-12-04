const multer = require('multer');

// An object that filter the types of the images
// that can be accepted
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

// An object that contains the destination folder of the file 
// and rename the file to a unique name
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

// Presume the field name is 'image' in the front end
const imageParser = multer({ storage: fileStorage, fileFilter: fileFilter }).array('images');

module.exports = imageParser;