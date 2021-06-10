"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const { v4: uuidv4, validate } = require('uuid');
exports.uploadProductImage = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            const { id } = req.auth;
            const folder = path_1.default.join(__dirname, `../static/productImages/${id}`);
            fs_1.default.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path_1.default.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 10, //10 MB
    },
});
//# sourceMappingURL=uploadProductImg.js.map