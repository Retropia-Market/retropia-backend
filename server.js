require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const { v4: uuidv4, validate } = require('uuid');

const {
    usersController,
    productsController,
    reviewsController,
    bidsController,
    favouritesController,
} = require('./controllers');

const {
    validateAuthorization,
    uploadProductImage,
    uploadImg,
} = require('./middlewares/');

const { PORT } = process.env;

const staticPath = path.resolve(__dirname, 'static');

const app = express();

app.use(express.json());
app.use(express.static(staticPath));

//TODOS
app.get('/users', usersController.getUsers);

// USUARIOS ****************************************************************************************************************

// Registro
app.post('/users/register', usersController.registerUser);

// Login
app.post('/users/login', usersController.userLogin);

// Editar información
app.patch(
    '/users/:id/update-profile',
    validateAuthorization,
    usersController.updateProfile
);

// Actualizar password
app.patch(
    '/users/:id/update-password',
    validateAuthorization,
    usersController.updatePassword
);

// Actualizar imagen de usuario
app.post(
    '/users/:id/update-img',
    validateAuthorization,
    uploadImg.uploadUserImg.single('userImg'),
    usersController.updateImage
);
// Borrar imagen de usuario
app.delete(
    '/users/:id/delete-img',
    validateAuthorization,
    usersController.deleteImage
);

// FAVORITOS ****************************************************************************************************************

// Add favourite
app.post(
    '/:productId/addFavourite/:userId',
    validateAuthorization,
    favouritesController.addFavourite
);

// Remove favourite
app.delete(
    '/:productId/removeFavourite/:userId',
    validateAuthorization,
    favouritesController.removeFavourite
);

// Get all user favourites
app.get(
    '/:userId/getFavourites/',
    validateAuthorization,
    favouritesController.getUserFavourites
);

// Get user favourite by favourite_id
app.get(
    '/:userId/getFavourites/:favouriteId',
    validateAuthorization,
    favouritesController.getFavouriteById
);

// CATALOGO ***************************************************************************************************************

// ver productos
app.get('/catalogue', productsController.getCatalogue);

//Ver un producto por ID
app.get('/catalogue/:id', productsController.getSingleProduct);

//Buscar productos
app.get('/search/:term', productsController.searchCatalogue);

//Obtener productos usuario(Temporal)
app.get('/users/:id/catalogue', productsController.getCatalogueByUserId);

//Obtener los productos mas visitados
app.get('/top', productsController.getTopProducts);

//Vender Producto
app.post(
    '/catalogue/sell',
    validateAuthorization,
    uploadProductImage.array('images'),
    productsController.addProductToSellList
);
//Borrar Producto
app.delete(
    '/catalogue/:id/product-delete',
    validateAuthorization,
    productsController.removeProductbyId
);

//Actualizar Producto por ID ()
app.patch(
    '/catalogue/:id/update',
    validateAuthorization,
    productsController.updateProduct
);
app.patch(
    '/catalogue/:id/sale',
    validateAuthorization,
    productsController.updateSaleStatus
);
app.post(
    '/catalogue/:id/images',
    validateAuthorization,
    uploadProductImage.array('images'),
    productsController.addMoreImagesToProduct
);

// REVIEWS ****************************************************************************************************************

app.get('/catalogue/:id/review', reviewsController.getReviewByProductId);

app.patch(
    '/catalogue/:id/review/create',
    validateAuthorization,
    reviewsController.addReviewToProduct
);

app.patch(
    '/catalogue/:id/review/update',
    validateAuthorization,
    reviewsController.updateReview
);

app.delete(
    '/catalogue/:id/review/delete',
    validateAuthorization,
    reviewsController.deleteReview
);

// OFERTAS ****************************************************************************************************************

// Ver ofertas por UserId
app.get(
    '/products/bid/user/:userId',
    validateAuthorization,
    bidsController.getUserBidsById
);

// Ver ofertas por ProductId
app.get('/products/:productId/bid', bidsController.getProductsBidsById);

// Hacer Oferta
app.post(
    '/products/:productId/bid',
    validateAuthorization,
    bidsController.placeBid
);

// Eliminar Oferta
app.delete(
    '/products/bid/:bidId/delete',
    validateAuthorization,
    bidsController.deleteBidById
);

//Modifica Oferta
app.patch(
    '/products/bid/:bidId/modify',
    validateAuthorization,
    bidsController.modifyBidById
);

// ERROR HANDLER *********************************************************************************************************

app.use(async (err, req, res, next) => {
    const status = err.isJoi ? 400 : err.code || 500;
    res.status(status);
    res.send({ resultado: 'ERROR', error: err.message });
});

//SERVER LISTENER ********************************************************************************************************

app.listen(PORT, () => console.log(`server escuchando en puerto ${PORT}`));
