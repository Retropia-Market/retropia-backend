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
exports.deleteImageById = void 0;
const fs = require('fs').promises;
const repositories_1 = require("../repositories");
// TODO: REVISAR TIPOS
const deleteImageById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { id: userId } = req.auth;
        const image = yield repositories_1.imagesRepository.findImageByImageId(id);
        if (!image) {
            const err = new Error('No existe la imagen');
            err.code = 404;
            throw err;
        }
        if (userId !== image.user_id) {
            const err = new Error('Sin permisos, sólo el dueño de la venta o el admin puede borrar');
            err.code = 403;
            throw err;
        }
        yield repositories_1.imagesRepository.deleteImageById(id);
        yield fs.unlink('src/static/' + image.url);
        res.status(204);
        res.send();
    }
    catch (err) {
        next(err);
    }
});
exports.deleteImageById = deleteImageById;
//# sourceMappingURL=images-controller.js.map