import cors from 'cors';
// import ws from '../ws';
import express from 'express';
import path from 'path';

import {
    usersController,
    productsController,
    reviewsController,
    bidsController,
    favouritesController,
    categoriesController,
    thirdPartyController,
    chatController,
    mailController,
    notificationController,
} from './controllers';

import {
    validateAuthorization,
    uploadProductImage,
    uploadUserImg,
} from './middlewares';
const staticPath = path.resolve(__dirname, 'static');

const app = express();

//Enable CORS

app.use(express.static(staticPath));
app.use(cors());

app.use(express.json());

//TODOS
app.get('/users', usersController.getUsers);

// USUARIOS ****************************************************************************************************************

// Registro
app.post(
    '/users/register',
    usersController.registerUser,
    mailController.accountVerification
);

// Verificacion de email
app.get('/verify-email/:email_code', usersController.emailVerification);

// Login
app.post('/users/login', usersController.userLogin);

// Google Login
app.post('/users/login-google', usersController.userGoogleLogin);

// Password Recovery Request
app.post(
    '/users/password-recovery',
    usersController.passwordRecoveryRequest,
    mailController.passwordRecovery
);

// Password Recovery
app.post('/users/password-reset/:token', usersController.passwordRecovery);

// Obtener info de usuario
app.get('/users/:id', usersController.getUserById);

// Editar información
app.patch(
    '/users/:id/update-profile',
    validateAuthorization,
    usersController.updateProfile
);

// Establecer password
app.post(
    '/users/:id/set-password',
    validateAuthorization,
    usersController.setPassword
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
    uploadUserImg.single('userImg'),
    usersController.updateImage
);

// Actualizar imagen de usuario
app.patch(
    '/users/update-banner',
    validateAuthorization,
    uploadProductImage.single('banner'),
    usersController.addBannerImage
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
//Obtener los productos mas visitados
app.get('/new', productsController.getNewProducts);

//Obtener productos relacionados con el producto que se esta viendo.

app.get(
    '/catalogue/seemore/:subcategory',
    productsController.getSimilarProducts
);

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

//Actualizar estado de venta de producto(en venta o vendido)

app.patch(
    '/catalogue/:id/sale',
    validateAuthorization,
    productsController.updateSaleStatus
);

//Añadir mas imagenes al producto

app.post(
    '/catalogue/:id/images',
    validateAuthorization,
    uploadProductImage.array('images'),
    productsController.addMoreImagesToProduct
);

// REVIEWS ****************************************************************************************************************

app.get('/catalogue/:id/review', reviewsController.getReviewByProductId);

app.post(
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

app.get(
    '/users/:userId/review/reviews-made',
    validateAuthorization,
    reviewsController.getMadeReviews
);

app.get(
    '/users/:userId/review/reviews-received',
    validateAuthorization,
    reviewsController.getReceivedReviews
);

app.get('/user/:id/rating', reviewsController.getAvgReviewScoreByUser);

// OFERTAS ****************************************************************************************************************

// Ver ofertas realizadas por UserId
app.get(
    '/products/bid/user/:userId/made',
    validateAuthorization,
    bidsController.getUserBidsById
);

// Ver ofertas recibidas por SellerId
app.get(
    '/products/bid/user/:userId/received',
    validateAuthorization,
    bidsController.getUserReceivedBidsBySellerId
);

// Ver ofertas completadas por BuyerId
app.get(
    '/products/bid/user/:userId/completed',
    validateAuthorization,
    bidsController.getUserCompletedBidsByBuyerId
);

// Ver ofertas recibidas por ProductId
app.get('/products/:productId/bid', bidsController.getProductsBidsById);

// Hacer Oferta
app.post(
    '/products/:productId/bid',
    validateAuthorization,
    bidsController.placeBid
);

// Aceptar Oferta by ID
app.patch(
    '/products/bid/:bidId/accept',
    validateAuthorization,
    bidsController.acceptBid
);

// Rechazar Oferta by ID
app.patch(
    '/products/bid/:bidId/decline',
    validateAuthorization,
    bidsController.declineBid
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

// CATEGORIES *********************************************************************************************************

// Get subcategories with categories
app.get('/categories/', categoriesController.getCategories);

// CHAT ****************************************************************************************************************

//Get contacts with lastMessage

app.get(
    '/chats/:userId/get-contacts',
    validateAuthorization,
    chatController.getContactList
);

// Get messages between two users

app.get(
    '/chats/:srcId/get-messages/:dstId',
    validateAuthorization,
    chatController.getMessages
);

// Add user to contacts

app.post(
    '/chats/:srcId/add-contact/:dstId',
    validateAuthorization,
    chatController.addContact
);

// Send message to user

app.post(
    '/chats/:srcId/send-message/:dstId/',
    validateAuthorization,
    chatController.addMessage
);

//Notifications

app.get(
    '/api/notifications/bids',
    validateAuthorization,
    notificationController.getBidsNotifications
);

app.get(
    '/api/notifications/reviews',
    validateAuthorization,
    notificationController.getReviewsNotifications
);

app.get(
    '/api/notifications/messages',
    validateAuthorization,
    notificationController.getMessagesNotifications
);

app.get(
    '/api/notifications/sales',
    validateAuthorization,
    notificationController.getSalesNotifications
);

//EXTERNAL APIS

app.get('/rawg/search/:game', thirdPartyController.getRawgVideoGameInfo);

app.get('/rawg/platform/', thirdPartyController.getRawgConsoleInfo);

app.get('/sell/autocomplete/:input', thirdPartyController.getAutoComplete);

app.post(
    '/sell/vision/',
    validateAuthorization,
    uploadProductImage.single('image'),
    thirdPartyController.getGoogleVision
);

// ERROR HANDLER *********************************************************************************************************

app.use(async (err, req, res, next) => {
    const status = err.isJoi ? 400 : err.code || 500;
    res.status(status);
    res.send({ resultado: 'ERROR', error: err.message });
});

module.exports = { app };
