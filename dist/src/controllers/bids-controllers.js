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
exports.getUserReceivedBidsBySellerId = exports.getProductsBidsById = exports.getUserBidsById = exports.modifyBidById = exports.deleteBidById = exports.placeBid = exports.acceptBid = exports.declineBid = void 0;
const joi_1 = __importDefault(require("joi"));
const repositories_1 = require("../repositories");
// TODO: REVISAR TIPOS
const placeBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const data = req.body;
        const { productId } = req.params;
        const schema = joi_1.default.object({
            message: joi_1.default.string().max(500).required(),
            bidPrice: joi_1.default.number().required(),
        });
        yield schema.validateAsync(data);
        const product = yield repositories_1.productsRepository.findProductById(productId);
        if (!product) {
            const err = new Error('No se ha encontrado el producto');
            err.code = 404;
            throw err;
        }
        if (product.seller_id === id) {
            const err = new Error('No puedes hacer ofertas a objetos que te pertenecen');
            err.code = 403;
            throw err;
        }
        const bidExist = yield repositories_1.bidsRepository.checkBidData(id, productId);
        if (bidExist.length) {
            const err = new Error('Ya has ofertado por este producto.');
            err.code = 409;
            throw err;
        }
        yield repositories_1.bidsRepository.placeBid(id, productId, data.bidPrice, data.message);
        res.send({ Status: 'OK', Message: 'Oferta realizada con exito.' });
    }
    catch (error) {
        next(error);
    }
});
exports.placeBid = placeBid;
// TODO: REVISAR TIPOS
const acceptBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { bidId } = req.params;
        const bidAccepted = yield repositories_1.bidsRepository.getBidById(bidId);
        const product = yield repositories_1.productsRepository.findProductById(bidAccepted.product_id);
        if (id !== product.seller_id) {
            const err = new Error('No tienes permisos para aceptar esta oferta');
            err.code = 401;
            throw err;
        }
        if (bidAccepted.bid_status === 'aceptado') {
            const err = new Error('Ya has aceptado la oferta por este producto.');
            err.code = 409;
            throw err;
        }
        if (bidAccepted.bid_status === 'rechazado') {
            const err = new Error('Ya has rechazado la oferta por este producto.');
            err.code = 409;
            throw err;
        }
        const productBids = yield repositories_1.bidsRepository.getProductsBidsById(product.id);
        for (const bid of productBids) {
            repositories_1.bidsRepository.declineBid(bid.id);
        }
        yield repositories_1.bidsRepository.acceptBid(bidId);
        yield repositories_1.productsRepository.updateSaleStatus('vendido', product.id);
        res.send({ Status: 'OK', Message: 'Oferta aceptada con exito.' });
    }
    catch (error) {
        next(error);
    }
});
exports.acceptBid = acceptBid;
// TODO: REVISAR TIPOS
const declineBid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { bidId } = req.params;
        const bid = yield repositories_1.bidsRepository.getBidById(bidId);
        const product = yield repositories_1.productsRepository.findProductById(bid.product_id);
        if (id !== product.seller_id) {
            const err = new Error('No tienes permisos para aceptar esta oferta');
            err.code = 401;
            throw err;
        }
        if (bid.bid_status === ('rechazado' || 'aceptado')) {
            const err = new Error('Esta oferta ya se ha respondido');
            err.code = 409;
            throw err;
        }
        const updatedBid = yield repositories_1.bidsRepository.declineBid(bidId);
        res.send({
            Status: 'OK',
            Message: 'Oferta rechaza con exito',
            updatedBid,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.declineBid = declineBid;
// TODO: REVISAR TIPOS
const deleteBidById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { bidId } = req.params;
        const bidData = yield repositories_1.bidsRepository.getBidById(bidId);
        if (!bidData.length) {
            const err = new Error('La oferta no existe');
            err.code = 404;
            throw err;
        }
        if (bidData[0].user_id !== id) {
            const err = new Error('No tienes permisos para borrar esta oferta');
            err.code = 401;
            throw err;
        }
        yield repositories_1.bidsRepository.deleteBid(bidId);
        res.status = 204;
        res.send({ Status: 'OK', Message: 'Oferta producto eliminada con exito.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBidById = deleteBidById;
// TODO: REVISAR TIPOS
const modifyBidById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const data = req.body;
        const { bidId } = req.params;
        const bidData = yield repositories_1.bidsRepository.getBidById(bidId);
        console.log(data);
        if (!bidData.length) {
            const err = new Error('La oferta no existe');
            err.code = 404;
            throw err;
        }
        if (bidData[0].user_id !== id) {
            const err = new Error('No tienes permisos para modificar esta oferta');
            err.code = 401;
            throw err;
        }
        yield repositories_1.bidsRepository.modifyBid(bidId, data);
        res.status = 204;
        res.send({
            Status: 'OK',
            Message: 'Oferta de producto modificada con exito.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.modifyBidById = modifyBidById;
const getUserBidsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const bids = yield repositories_1.bidsRepository.getUserBidsById(userId);
        res.send({ bids });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserBidsById = getUserBidsById;
const getUserReceivedBidsBySellerId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const bids = yield repositories_1.bidsRepository.getUserReceivedBidsBySellerId(userId);
        res.send({ bids });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserReceivedBidsBySellerId = getUserReceivedBidsBySellerId;
const getProductsBidsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const bids = yield repositories_1.bidsRepository.getProductsBidsById(productId);
        res.send({ bids });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsBidsById = getProductsBidsById;
//# sourceMappingURL=bids-controllers.js.map