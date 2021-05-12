const Joi = require('joi');
const { database } = require('../infrastructure');

const {
    reviewsRepository,
    bidsRepository,
    productsRepository,
} = require('../repositories');

const getReviewByProductId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const schema = Joi.number().min(1).positive();
        await schema.validateAsync(id);
        const getReview = await reviewsRepository.getReviewByProductId(id);
        res.send(getReview);
    } catch (error) {
        next(error);
    }
};
const addReviewToProduct = async (req, res, next) => {
    try {
        //TODO - CHECK AUTH WITH BID
        const { id: userId } = req.auth;

        const { id } = req.params;
        const schema = Joi.object({
            review_rating: Joi.number().min(0).max(5).required(),
            review_text: Joi.string().required(),
        });
        await schema.validateAsync(req.body);

        const getProduct = await productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = '404';
            throw noProductError;
        }

        const productBid = await productsRepository.getBidByProdAndUser(
            id,
            userId
        );

        if (!productBid || productBid.bid_status != 'aceptado') {
            const noUserError = new Error(
                'No tienes permisos para realizar esta acción'
            );
            noUserError.code = '403';
            throw noUserError;
        }

        if (getProduct.sale_status != 'vendido') {
            const noSoldYetError = new Error(
                'Tu oferta no ha sido aceptada todavia'
            );
            noSoldYetError.code = '403';
            throw noSoldYetError;
        }

        const review = await reviewsRepository.addReviewToProduct(req.body, id);
        res.send(review);
    } catch (error) {
        next(error);
    }
};
const updateReview = async (req, res, next) => {
    try {
        const { id: userId } = req.auth;

        const { id } = req.params;
        const schema = Joi.object({
            review_rating: Joi.number().min(0).max(5).required(),
            review_text: Joi.string().required(),
        });
        await schema.validateAsync(req.body);

        const getProduct = await productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = '404';
            throw noProductError;
        }

        const productBid = await productsRepository.getBidByProdAndUser(
            id,
            userId
        );

        if (!productBid || productBid.bid_status != 'aceptado') {
            const noUserError = new Error(
                'No tienes permisos para realizar esta acción'
            );
            noUserError.code = '403';
            throw noUserError;
        }

        if (getProduct.sale_status != 'vendido') {
            const noSoldYetError = new Error(
                'Tu oferta no ha sido aceptada todavia'
            );
            noSoldYetError.code = '403';
            throw noSoldYetError;
        }

        const review = await reviewsRepository.updateReview(req.body, id);
        res.send(review);
    } catch (error) {
        next(error);
    }
};
const deleteReview = async (req, res, next) => {
    try {
        //TODO - CHECK AUTH WITH BID
        const { id: userId } = req.auth;

        const { id } = req.params;

        const getProduct = await productsRepository.findProductById(id);
        if (!getProduct) {
            const noProductError = new Error('El producto no existe');
            noProductError.code = '404';
            throw noProductError;
        }

        const productBid = await productsRepository.getBidByProdAndUser(
            id,
            userId
        );

        if (!productBid || productBid.bid_status != 'aceptado') {
            const noUserError = new Error(
                'No tienes permisos para realizar esta acción'
            );
            noUserError.code = '403';
            throw noUserError;
        }

        if (getProduct.sale_status != 'vendido') {
            const noSoldYetError = new Error(
                'Tu oferta no ha sido aceptada todavia'
            );
            noSoldYetError.code = '403';
            throw noSoldYetError;
        }

        await reviewsRepository.deleteReview(id);
        res.status(201);
        res.send('');
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getReviewByProductId,
    addReviewToProduct,
    updateReview,
    deleteReview,
};
