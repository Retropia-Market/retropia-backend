"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findImageByImageId = exports.createImage = exports.findImageById = exports.deleteImageById = void 0;
const infrastructure_1 = require("../infrastructure");
function findImageById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM products_img WHERE product_id = ?';
        const [images] = yield infrastructure_1.database.query(query, id);
        return images;
    });
}
exports.findImageById = findImageById;
function findImageByImageId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM products_img WHERE id = ?';
        const [images] = yield infrastructure_1.database.query(query, id);
        return images[0];
    });
}
exports.findImageByImageId = findImageByImageId;
function createImage(url, product_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO products_img (product_id, url) VALUES (?, ?)';
        const [result] = yield infrastructure_1.database.query(query, [product_id, url]);
        return findImageById(result.insertId);
    });
}
exports.createImage = createImage;
function deleteImageById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM products_img WHERE id = ?';
        return yield infrastructure_1.database.query(query, id);
    });
}
exports.deleteImageById = deleteImageById;
//# sourceMappingURL=images-repository.js.map