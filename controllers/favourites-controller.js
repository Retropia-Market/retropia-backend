const { nextDay } = require('date-fns');
const { favouritesRepository } = require('../repositories');
const { isCorrectUser } = require('./users-controller');
const { productsRepository } = require('../repositories');
const { id } = require('date-fns/locale');

async function addFavourite(req, res, next) {
  try {
    const { userId, productId } = req.params;

    await isCorrectUser(userId, req.auth.id);

    if (!(await productsRepository.findProductById(productId))) {
      const err = new Error('No se ha encontrado el producto');
      err.code = 404;
      throw err;
    }

    if (await favouritesRepository.userHasFavourite(userId, productId)) {
      const err = new Error('Producto ya guardado como favorito');
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
}

async function removeFavourite(req, res, next) {
  try {
    const { userId, productId } = req.params;

    await isCorrectUser(userId, req.auth.id);

    if (!(await productsRepository.findProductById(productId))) {
      const err = new Error('No se ha encontrado el producto');
      err.code = 404;
      throw err;
    }

    if (!(await favouritesRepository.userHasFavourite(userId, productId))) {
      const err = new Error('Producto no guardado como favorito');
      err.code = 403;
      throw err;
    }

    await favouritesRepository.removeFavourite(userId, productId);

    res.status(200);
    res.send('Deleted');
  } catch (error) {
    next(error);
  }
}

async function getUserFavourites(req, res, next) {
  try {
    const { userId } = req.params;

    await isCorrectUser(userId, req.auth.id);

    const favourites = await favouritesRepository.getUserFavourites(userId);

    res.status(200);
    res.send(favourites);
  } catch (error) {
    next(error);
  }
}

async function getFavouriteById(req, res, next) {
  try {
    const { userId, favouriteId } = req.params;

    await isCorrectUser(userId, req.auth.id);

    const favourite = await favouritesRepository.getFavouriteById(favouriteId);
    if (!favourite) {
      const err = new Error('No se ha encontrado el favorito');
      err.code = 404;
      throw err;
    }

    const product = await productsRepository.getSingleProduct(favourite.id);
    if (!product) {
      const err = new Error('No se ha encontrado el producto');
      err.code = 404;
      throw err;
    }

    res.status(200);
    res.send(product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addFavourite,
  removeFavourite,
  getUserFavourites,
  getFavouriteById,
  getFavouriteById,
};
