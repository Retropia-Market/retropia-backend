const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4, validate } = require('uuid');
const uploadProductImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id } = req.auth;
            const folder = path.join(__dirname, `../static/productImages/${id}`);
            fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 10, //10 MB
    },
});
module.exports = { uploadProductImage };
