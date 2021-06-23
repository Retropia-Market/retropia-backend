import { favouritesRepository } from '../repositories';
import { isCorrectUser } from '../middlewares';
import { productsRepository } from '../repositories';
import { RequestHandler } from 'express';
import { ErrnoException } from '../models/Error';

// TODO: REVISAR TIPOS
const addFavourite: RequestHandler = async (req: any, res, next) => {
    try {
        const { userId, productId } = req.params;

        await isCorrectUser(userId, req.auth.id);

        if (!(await productsRepository.findProductById(productId))) {
            const err: ErrnoException = new Error(
                'No se ha encontrado el producto'
            );
            err.code = 404;
            throw err;
        }

        if (await favouritesRepository.userHasFavourite(userId, productId)) {
            const err: ErrnoException = new Error(
                'Producto ya guardado como favorito'
            );
            err.code = 403;
            throw err;
        }

        const favourite = await favouritesRepository.addFavourite(
            userId,
            productId
        );

        res.status(201);
        res.send(favourite);
    } catch (error) {
        next(error);
    }
};

// TODO: REVISAR TIPOS
const removeFavourite: RequestHandler = async (req: any, res, next) => {
    try {
        const { userId, productId } = req.params;

        await isCorrectUser(userId, req.auth.id);

        if (!(await productsRepository.findProductById(productId))) {
            const err: ErrnoException = new Error(
                'No se ha encontrado el producto'
            );
            err.code = 404;
            throw err;
        }

        if (!(await favouritesRepository.userHasFavourite(userId, productId))) {
            const err: ErrnoException = new Error(
                'Producto no guardado como favorito'
            );
            err.code = 403;
            throw err;
        }

        await favouritesRepository.removeFavourite(userId, productId);

        res.status(200);
        res.send('Deleted');
    } catch (error) {
        next(error);
    }
};

// TODO: REVISAR TIPOS
const getUserFavourites: RequestHandler = async (req: any, res, next) => {
    try {
        const { userId } = req.params;

        await isCorrectUser(userId, req.auth.id);

        const favourites = await favouritesRepository.getUserFavourites(userId);

        res.status(200);
        res.send(favourites);
    } catch (error) {
        next(error);
    }
};

// TODO: REVISAR TIPOS
const getFavouriteById: RequestHandler = async (req: any, res, next) => {
    try {
        const { userId, favouriteId } = req.params;

        await isCorrectUser(userId, req.auth.id);

        const favourite = await favouritesRepository.getFavouriteById(
            favouriteId
        );
        if (!favourite) {
            const err: ErrnoException = new Error(
                'No se ha encontrado el favorito'
            );
            err.code = 404;
            throw err;
        }

        const product = await productsRepository.findProductById(favourite.id);
        if (!product) {
            const err: ErrnoException = new Error(
                'No se ha encontrado el producto'
            );
            err.code = 404;
            throw err;
        }

        res.status(200);
        res.send(product);
    } catch (error) {
        next(error);
    }
};

export { addFavourite, removeFavourite, getUserFavourites, getFavouriteById };
