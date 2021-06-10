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
exports.getReceivedReviews = exports.getMadeReviews = exports.getAvgReviewScoreByUser = exports.deleteReview = exports.updateReview = exports.addReviewToProduct = exports.getReviewByProductId = void 0;
const joi_1 = __importDefault(require("joi"));
const middlewares_1 = require("../middlewares");
const repositories_1 = require("../repositories");
const getReviewByProductId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const schema = joi_1.default.number().min(1).positive();
        yield schema.validateAsync(id);
        const getReview = yield repositories_1.reviewsRepository.getReviewByProductId(id);
        if (!getReview) {
            const noReviewError = new Error('Este artículo todavía no tiene reviews');
            noReviewError.code = 404;
            throw noReviewError;
        }
        else {
            res.send(getReview);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewByProductId = getReviewByProductId;
// TODO: REVISAR TIPOS
const addReviewToProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TODO - CHECK AUTH WITH BID
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = joi_1.default.object({
            review_rating: joi_1.default.number().min(0).max(5).required(),
            review_text: joi_1.default.string().required(),
        });
        yield schema.validateAsync(req.body);
        const getProduct = yield repositories_1.productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = 404;
            throw noProductError;
        }
        const productBid = yield repositories_1.productsRepository.getBidByProdAndUser(id, userId);
        // if (!productBid || productBid.bid_status != 'aceptado') {
        //     const noUserError = new Error(
        //         'No tienes permisos para realizar esta acción'
        //     );
        //     noUserError.code = '403';
        //     throw noUserError;
        // }
        // if (getProduct.sale_status != 'vendido') {
        //     const noSoldYetError = new Error(
        //         'Tu oferta no ha sido aceptada todavia'
        //     );
        //     noSoldYetError.code = '403';
        //     throw noSoldYetError;
        // }
        const review = yield repositories_1.reviewsRepository.addReviewToProduct(req.body, id, userId);
        res.send(review);
    }
    catch (error) {
        next(error);
    }
});
exports.addReviewToProduct = addReviewToProduct;
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = joi_1.default.object({
            review_rating: joi_1.default.number().min(0).max(5).required(),
            review_text: joi_1.default.string().required(),
        });
        yield schema.validateAsync(req.body);
        const getProduct = yield repositories_1.productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = 404;
            throw noProductError;
        }
        const productBid = yield repositories_1.productsRepository.getBidByProdAndUser(id, userId);
        // if (!productBid || productBid.bid_status != 'aceptado') {
        //     const noUserError = new Error(
        //         'No tienes permisos para realizar esta acción'
        //     );
        //     noUserError.code = '403';
        //     throw noUserError;
        // }
        // if (getProduct.sale_status != 'vendido') {
        //     const noSoldYetError = new Error(
        //         'Tu oferta no ha sido aceptada todavia'
        //     );
        //     noSoldYetError.code = '403';
        //     throw noSoldYetError;
        // }
        const review = yield repositories_1.reviewsRepository.updateReview(req.body, id);
        res.send(review);
    }
    catch (error) {
        next(error);
    }
});
exports.updateReview = updateReview;
// TODO: REVISAR TIPOS
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TODO - CHECK AUTH WITH BID
        const { id: userId } = req.auth;
        const { id } = req.params;
        const getProduct = yield repositories_1.productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = 404;
            throw noProductError;
        }
        const productBid = yield repositories_1.productsRepository.getBidByProdAndUser(id, userId);
        // if (!productBid || productBid.bid_status != 'aceptado') {
        //     const noUserError = new Error(
        //         'No tienes permisos para realizar esta acción'
        //     );
        //     noUserError.code = '403';
        //     throw noUserError;
        // }
        // if (getProduct.sale_status != 'vendido') {
        //     const noSoldYetError = new Error(
        //         'Tu oferta no ha sido aceptada todavia'
        //     );
        //     noSoldYetError.code = '403';
        //     throw noSoldYetError;
        // }
        yield repositories_1.reviewsRepository.deleteReview(id);
        res.status(201);
        res.send({
            status: 'OK',
            message: 'Review Eliminada',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
const getAvgReviewScoreByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.params;
        const getReviewRating = yield repositories_1.reviewsRepository.getAvgReviewScoreByUser(userId);
        res.send(getReviewRating);
    }
    catch (error) {
        next(error);
    }
});
exports.getAvgReviewScoreByUser = getAvgReviewScoreByUser;
const getMadeReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { userId } = req.params;
        middlewares_1.isCorrectUser(userId, id);
        const madeReviews = yield repositories_1.reviewsRepository.getMadeReviews(userId);
        res.send({
            Status: 'OK',
            madeReviews,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMadeReviews = getMadeReviews;
const getReceivedReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { userId } = req.params;
        const receivedReviews = yield repositories_1.reviewsRepository.getReceivedReviews(userId);
        res.send({
            Status: 'OK',
            receivedReviews,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReceivedReviews = getReceivedReviews;
//# sourceMappingURL=reviews-controller.js.map