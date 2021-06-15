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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarProducts = exports.getTopProducts = exports.getCatalogueByUserId = exports.addMoreImagesToProduct = exports.searchCatalogue = exports.updateSaleStatus = exports.getSingleProduct = exports.updateProduct = exports.removeProductbyId = exports.getCatalogue = exports.addProductToSellList = void 0;
const joi_1 = __importDefault(require("joi"));
const fs = require('fs').promises;
//TODO - NORMALIZE NAMES && COMMENT
const { productsRepository, imagesRepository } = require('../repositories');
const getCatalogue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productsRepository.getCatalogue(req.query ? req.query : '');
        res.send(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getCatalogue = getCatalogue;
const getCatalogueByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const schema = joi_1.default.number().positive().min(1);
        yield schema.validateAsync(id);
        const productsByUserId = yield productsRepository.getCatalogueByUserId(id);
        res.send(productsByUserId);
    }
    catch (error) {
        next(error);
    }
});
exports.getCatalogueByUserId = getCatalogueByUserId;
// TODO: REVISAR TIPOS
const addProductToSellList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { files } = req;
        const schema = joi_1.default.object({
            name: joi_1.default.string().required(),
            status: joi_1.default.string().required(),
            product_type: joi_1.default.string().required(),
            location: joi_1.default.string().required(),
            price: joi_1.default.number().required().min(0).max(100000),
            description: joi_1.default.string(),
            subcategory: joi_1.default.string(),
        });
        yield schema.validateAsync(req.body);
        const createProduct = yield productsRepository.addProductToSellList(req.body, id);
        for (const file of files) {
            const url = `productImages/${id}/${file.filename}`;
            yield imagesRepository.createImage(url, createProduct.id);
        }
        const finalProduct = yield productsRepository.findProductById(createProduct.id);
        res.status(201);
        res.send(finalProduct);
    }
    catch (error) {
        next(error);
    }
});
exports.addProductToSellList = addProductToSellList;
// TODO: REVISAR TIPOS
const addMoreImagesToProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.auth;
        const { files } = req;
        const { id } = req.params;
        const searchProduct = yield productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;
            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error('No tienes permiso para actualizar este producto');
            errorAuth.code = 403;
            throw errorAuth;
        }
        if (searchProduct.sale_status === 'vendido') {
            const errorAlreadySold = new Error('No puedes modificar productos ya vendidos');
            errorAlreadySold.code = 403;
            throw errorAlreadySold;
        }
        for (const image of files) {
            const url = `static/images/${id}/${image.filename}`;
            const addImage = yield imagesRepository.createImage(url, id);
        }
        res.status(201);
        res.send('Imagenes subidas correctamente!');
    }
    catch (error) {
        next(error);
    }
});
exports.addMoreImagesToProduct = addMoreImagesToProduct;
// TODO: REVISAR TIPOS
const removeProductbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = joi_1.default.object({
            id: joi_1.default.number().min(1),
        });
        yield schema.validateAsync({ id });
        const searchProduct = yield productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;
            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error('No tienes permiso para borrar este producto');
            errorAuth.code = 403;
            throw errorAuth;
        }
        const images = yield imagesRepository.findImageById(id);
        images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            const { url } = image;
            yield fs.unlink('src/static/' + url);
        }));
        yield productsRepository.removeProductById(id);
        res.status(204);
        res.send();
    }
    catch (error) {
        next(error);
    }
});
exports.removeProductbyId = removeProductbyId;
// TODO: REVISAR TIPOS
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(1).max(20),
            status: joi_1.default.string().min(1).max(10),
            location: joi_1.default.string().min(1),
            price: joi_1.default.number().min(1).max(100000),
            description: joi_1.default.string().min(1).max(500),
            subcategory: joi_1.default.string().min(1).max(15),
        });
        yield schema.validateAsync(req.body);
        const searchProduct = yield productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;
            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error('No tienes permiso para actualizar este producto');
            errorAuth.code = 403;
            throw errorAuth;
        }
        if (searchProduct.sale_status === 'vendido') {
            const errorAlreadySold = new Error('No puedes modificar productos ya vendidos');
            errorAlreadySold.code = 403;
            throw errorAlreadySold;
        }
        const product = yield productsRepository.updateProduct(req.body, id);
        res.send(product);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
// TODO: REVISAR TIPOS
const updateSaleStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const { sale_status } = req.body;
        const schema = joi_1.default.object({
            sale_status: joi_1.default.string().required(),
        });
        yield schema.validateAsync({ sale_status });
        const searchProduct = yield productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;
            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error('No tienes permiso para actualizar este producto');
            errorAuth.code = 403;
            throw errorAuth;
        }
        const update = yield productsRepository.updateSaleStatus(sale_status, id);
        res.send(update);
    }
    catch (error) {
        next(error);
    }
});
exports.updateSaleStatus = updateSaleStatus;
const getSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield productsRepository.getSingleProduct(id);
        if (!product) {
            const err = new Error('No existe el producto');
            err.code = 404;
            throw err;
        }
        res.send(product);
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleProduct = getSingleProduct;
const searchCatalogue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { term } = req.params;
        const data = yield productsRepository.searchCatalogue(term);
        res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.searchCatalogue = searchCatalogue;
const getTopProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield productsRepository.getTopProducts();
        res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getTopProducts = getTopProducts;
const getSimilarProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subcategory } = req.params;
        const schema = joi_1.default.object({
            subcategory: joi_1.default.string().required(),
        });
        yield schema.validateAsync({ subcategory });
        const data = yield productsRepository.getSimilarProducts(subcategory);
        res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getSimilarProducts = getSimilarProducts;
//# sourceMappingURL=products-controllers.js.map