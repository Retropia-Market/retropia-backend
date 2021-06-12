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
const cors_1 = __importDefault(require("cors"));
// import ws from '../ws';
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const controllers_1 = require("./controllers");
const middlewares_1 = require("./middlewares");
const staticPath = path_1.default.resolve(__dirname, 'static');
const app = express_1.default();
//Enable CORS
app.use(express_1.default.static(staticPath));
app.use(cors_1.default());
app.use(express_1.default.json());
//TODOS
app.get('/users', controllers_1.usersController.getUsers);
// USUARIOS ****************************************************************************************************************
// Registro
app.post('/users/register', controllers_1.usersController.registerUser);
// Login
app.post('/users/login', controllers_1.usersController.userLogin);
// Obtener info de usuario
app.get('/users/:id', controllers_1.usersController.getUserById);
// Editar información
app.patch('/users/:id/update-profile', middlewares_1.validateAuthorization, controllers_1.usersController.updateProfile);
// Actualizar password
app.patch('/users/:id/update-password', middlewares_1.validateAuthorization, controllers_1.usersController.updatePassword);
// Actualizar imagen de usuario
app.post('/users/:id/update-img', middlewares_1.validateAuthorization, middlewares_1.uploadUserImg.single('userImg'), controllers_1.usersController.updateImage);
// Borrar imagen de usuario
app.delete('/users/:id/delete-img', middlewares_1.validateAuthorization, controllers_1.usersController.deleteImage);
// FAVORITOS ****************************************************************************************************************
// Add favourite
app.post('/:productId/addFavourite/:userId', middlewares_1.validateAuthorization, controllers_1.favouritesController.addFavourite);
// Remove favourite
app.delete('/:productId/removeFavourite/:userId', middlewares_1.validateAuthorization, controllers_1.favouritesController.removeFavourite);
// Get all user favourites
app.get('/:userId/getFavourites/', middlewares_1.validateAuthorization, controllers_1.favouritesController.getUserFavourites);
// Get user favourite by favourite_id
app.get('/:userId/getFavourites/:favouriteId', middlewares_1.validateAuthorization, controllers_1.favouritesController.getFavouriteById);
// CATALOGO ***************************************************************************************************************
// ver productos
app.get('/catalogue', controllers_1.productsController.getCatalogue);
//Ver un producto por ID
app.get('/catalogue/:id', controllers_1.productsController.getSingleProduct);
//Buscar productos
app.get('/search/:term', controllers_1.productsController.searchCatalogue);
//Obtener productos usuario(Temporal)
app.get('/users/:id/catalogue', controllers_1.productsController.getCatalogueByUserId);
//Obtener los productos mas visitados
app.get('/top', controllers_1.productsController.getTopProducts);
//Obtener productos relacionados con el producto que se esta viendo.
app.get('/catalogue/seemore/:subcategory', controllers_1.productsController.getSimilarProducts);
//Vender Producto
app.post('/catalogue/sell', middlewares_1.validateAuthorization, middlewares_1.uploadProductImage.array('images'), controllers_1.productsController.addProductToSellList);
//Borrar Producto
app.delete('/catalogue/:id/product-delete', middlewares_1.validateAuthorization, controllers_1.productsController.removeProductbyId);
//Actualizar Producto por ID ()
app.patch('/catalogue/:id/update', middlewares_1.validateAuthorization, controllers_1.productsController.updateProduct);
//Actualizar estado de venta de producto(en venta o vendido)
app.patch('/catalogue/:id/sale', middlewares_1.validateAuthorization, controllers_1.productsController.updateSaleStatus);
//Añadir mas imagenes al producto
app.post('/catalogue/:id/images', middlewares_1.validateAuthorization, middlewares_1.uploadProductImage.array('images'), controllers_1.productsController.addMoreImagesToProduct);
// REVIEWS ****************************************************************************************************************
app.get('/catalogue/:id/review', controllers_1.reviewsController.getReviewByProductId);
app.post('/catalogue/:id/review/create', middlewares_1.validateAuthorization, controllers_1.reviewsController.addReviewToProduct);
app.patch('/catalogue/:id/review/update', middlewares_1.validateAuthorization, controllers_1.reviewsController.updateReview);
app.delete('/catalogue/:id/review/delete', middlewares_1.validateAuthorization, controllers_1.reviewsController.deleteReview);
app.get('/users/:userId/review/reviews-made', middlewares_1.validateAuthorization, controllers_1.reviewsController.getMadeReviews);
app.get('/users/:userId/review/reviews-received', middlewares_1.validateAuthorization, controllers_1.reviewsController.getReceivedReviews);
app.get('/user/:id/rating', controllers_1.reviewsController.getAvgReviewScoreByUser);
// OFERTAS ****************************************************************************************************************
// Ver ofertas realizadas por UserId
app.get('/products/bid/user/:userId', middlewares_1.validateAuthorization, controllers_1.bidsController.getUserBidsById);
// Ver ofertas recibidas por UserId
app.get('/products/bid/user/:userId/received', middlewares_1.validateAuthorization, controllers_1.bidsController.getUserReceivedBidsBySellerId);
// Ver ofertas recibidas por ProductId
app.get('/products/:productId/bid', controllers_1.bidsController.getProductsBidsById);
// Hacer Oferta
app.post('/products/:productId/bid', middlewares_1.validateAuthorization, controllers_1.bidsController.placeBid);
// Aceptar Oferta by ID
app.patch('/products/bid/:bidId/accept', middlewares_1.validateAuthorization, controllers_1.bidsController.acceptBid);
// Rechazar Oferta by ID
app.patch('/products/bid/:bidId/decline', middlewares_1.validateAuthorization, controllers_1.bidsController.declineBid);
// Eliminar Oferta
app.delete('/products/bid/:bidId/delete', middlewares_1.validateAuthorization, controllers_1.bidsController.deleteBidById);
//Modifica Oferta
app.patch('/products/bid/:bidId/modify', middlewares_1.validateAuthorization, controllers_1.bidsController.modifyBidById);
// CATEGORIES *********************************************************************************************************
// Get subcategories with categories
app.get('/categories/', controllers_1.categoriesController.getCategories);
// CHAT ****************************************************************************************************************
//Get contacts with lastMessage
app.get('/chats/:userId/get-contacts', middlewares_1.validateAuthorization, controllers_1.chatController.getContactList);
// Get messages between two users
app.get('/chats/:srcId/get-messages/:dstId', middlewares_1.validateAuthorization, controllers_1.chatController.getMessages);
// Add user to contacts
app.post('/chats/:srcId/add-contact/:dstId', middlewares_1.validateAuthorization, controllers_1.chatController.addContact);
// Send message to user
app.post('/chats/:srcId/send-message/:dstId/', middlewares_1.validateAuthorization, controllers_1.chatController.addMessage);
//EXTERNAL APIS
app.get('/rawg/search/:game', controllers_1.gamesApiController.getRawgVideoGameInfo);
app.get('/rawg/platform/', controllers_1.gamesApiController.getRawgConsoleInfo);
app.get('/sell/autocomplete/:input', controllers_1.gamesApiController.getAutoComplete);
//TODO - Finish vision
app.post('/sell/vision/', middlewares_1.validateAuthorization, middlewares_1.uploadProductImage.single('image'), controllers_1.gamesApiController.getGoogleVision);
// ERROR HANDLER *********************************************************************************************************
app.use((err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const status = err.isJoi ? 400 : err.code || 500;
    res.status(status);
    res.send({ resultado: 'ERROR', error: err.message });
}));
module.exports = { app };
//# sourceMappingURL=app.js.map