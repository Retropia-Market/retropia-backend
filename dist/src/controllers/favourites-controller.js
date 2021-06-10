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
exports.getFavouriteById = exports.getUserFavourites = exports.removeFavourite = exports.addFavourite = void 0;
const repositories_1 = require("../repositories");
const middlewares_1 = require("../middlewares");
const repositories_2 = require("../repositories");
// TODO: REVISAR TIPOS
const addFavourite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        yield middlewares_1.isCorrectUser(userId, req.auth.id);
        if (!(yield repositories_2.productsRepository.findProductById(productId))) {
            const err = new Error('No se ha encontrado el producto');
            err.code = 404;
            throw err;
        }
        if (yield repositories_1.favouritesRepository.userHasFavourite(userId, productId)) {
            const err = new Error('Producto ya guardado como favorito');
            err.code = 403;
            throw err;
        }
        const favourite = yield repositories_1.favouritesRepository.addFavourite(userId, productId);
        res.status(201);
        res.send(favourite);
    }
    catch (error) {
        next(error);
    }
});
exports.addFavourite = addFavourite;
// TODO: REVISAR TIPOS
const removeFavourite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        yield middlewares_1.isCorrectUser(userId, req.auth.id);
        if (!(yield repositories_2.productsRepository.findProductById(productId))) {
            const err = new Error('No se ha encontrado el producto');
            err.code = 404;
            throw err;
        }
        if (!(yield repositories_1.favouritesRepository.userHasFavourite(userId, productId))) {
            const err = new Error('Producto no guardado como favorito');
            err.code = 403;
            throw err;
        }
        yield repositories_1.favouritesRepository.removeFavourite(userId, productId);
        res.status(200);
        res.send('Deleted');
    }
    catch (error) {
        next(error);
    }
});
exports.removeFavourite = removeFavourite;
// TODO: REVISAR TIPOS
const getUserFavourites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield middlewares_1.isCorrectUser(userId, req.auth.id);
        const favourites = yield repositories_1.favouritesRepository.getUserFavourites(userId);
        res.status(200);
        res.send(favourites);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserFavourites = getUserFavourites;
// TODO: REVISAR TIPOS
const getFavouriteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, favouriteId } = req.params;
        yield middlewares_1.isCorrectUser(userId, req.auth.id);
        const favourite = yield repositories_1.favouritesRepository.getFavouriteById(favouriteId);
        if (!favourite) {
            const err = new Error('No se ha encontrado el favorito');
            err.code = 404;
            throw err;
        }
        const product = yield repositories_2.productsRepository.getSingleProduct(favourite.id);
        if (!product) {
            const err = new Error('No se ha encontrado el producto');
            err.code = 404;
            throw err;
        }
        res.status(200);
        res.send(product);
    }
    catch (error) {
        next(error);
    }
});
exports.getFavouriteById = getFavouriteById;
//# sourceMappingURL=favourites-controller.js.map