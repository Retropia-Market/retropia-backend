import { ErrorRequestHandler, RequestHandler } from 'express';
import Joi from 'joi';
import { isCorrectUser } from '../middlewares';
import { ErrnoException } from '../models/Error';

import {
  reviewsRepository,
  bidsRepository,
  productsRepository,
} from '../repositories';

const getReviewByProductId: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schema = Joi.number().min(1).positive();
    await schema.validateAsync(id);
    const getReview = await reviewsRepository.getReviewByProductId(id);
    if (!getReview) {
      const noReviewError: ErrnoException = new Error(
        'Este artículo todavía no tiene reviews'
      );
      noReviewError.code = 404;
      throw noReviewError;
    } else {
      res.send(getReview);
    }
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const addReviewToProduct: RequestHandler = async (req: any, res, next) => {
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
      const noProductError: ErrnoException = new Error('El producto no existe');
      noProductError.code = 404;
      throw noProductError;
    }

    const productBid = await productsRepository.getBidByProdAndUser(id, userId);

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

    const review = await reviewsRepository.addReviewToProduct(
      req.body,
      id,
      userId
    );
    res.send(review);
  } catch (error) {
    next(error);
  }
};

const updateReview: RequestHandler = async (req: any, res, next) => {
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
      const noProductError: ErrnoException = new Error('El producto no existe');
      noProductError.code = 404;
      throw noProductError;
    }

    const productBid = await productsRepository.getBidByProdAndUser(id, userId);

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

    const review = await reviewsRepository.updateReview(req.body, id);
    res.send(review);
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const deleteReview: RequestHandler = async (req: any, res, next) => {
  try {
    //TODO - CHECK AUTH WITH BID
    const { id: userId } = req.auth;

    const { id } = req.params;

    const getProduct = await productsRepository.findProductById(id);
    if (!getProduct) {
      const noProductError: ErrnoException = new Error('El producto no existe');
      noProductError.code = 404;
      throw noProductError;
    }

    const productBid = await productsRepository.getBidByProdAndUser(id, userId);

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

    await reviewsRepository.deleteReview(id);
    res.status(201);
    res.send({
      status: 'OK',
      message: 'Review Eliminada',
    });
  } catch (error) {
    next(error);
  }
};

const getAvgReviewScoreByUser: RequestHandler = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const getReviewRating = await reviewsRepository.getAvgReviewScoreByUser(
      userId
    );
    res.send(getReviewRating);
  } catch (error) {
    next(error);
  }
};

const getMadeReviews: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { userId } = req.params;

    isCorrectUser(userId, id);

    const madeReviews = await reviewsRepository.getMadeReviews(userId);

    res.send({
      Status: 'OK',
      madeReviews,
    });
  } catch (error) {
    next(error);
  }
};

const getReceivedReviews: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { userId } = req.params;

    const receivedReviews = await reviewsRepository.getReceivedReviews(userId);

    res.send({
      Status: 'OK',
      receivedReviews,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getReviewByProductId,
  addReviewToProduct,
  updateReview,
  deleteReview,
  getAvgReviewScoreByUser,
  getMadeReviews,
  getReceivedReviews,
};
