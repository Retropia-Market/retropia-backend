const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const uploadUserImg = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'static/users-img/');
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
module.exports = {
    uploadUserImg,
};
