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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavouriteById = exports.getUserFavourites = exports.removeFavourite = exports.addFavourite = exports.userHasFavourite = void 0;
const infrastructure_1 = require("../infrastructure");
const products_repository_1 = require("./products-repository");
/**############################################################################
 *
 * Funcion para comprobar si el producto ya ha sido añadido como favorito
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {object} objeto con la informacion del favorito
 */
function userHasFavourite(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM favourites WHERE user_id = ? AND product_id = ?';
        const [favourite] = yield infrastructure_1.database.query(query, [userId, productId]);
        return favourite[0];
    });
}
exports.userHasFavourite = userHasFavourite;
/**############################################################################
 *
 * Funcion para añadir favorito
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {object} objeto con la informacion del favorito
 */
function addFavourite(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO favourites (product_id, user_id) VALUES (?,?)';
        const [result] = yield infrastructure_1.database.query(query, [productId, userId]);
        return getFavouriteById(result.insertId);
    });
}
exports.addFavourite = addFavourite;
/**############################################################################
 *
 * Funcion para eliminar un producto de favoritos
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {array} lista actualizada de los favoritos del usuario
 */
function removeFavourite(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM favourites WHERE user_id = ? AND product_id = ?';
        yield infrastructure_1.database.query(query, [userId, productId]);
        return getUserFavourites(userId);
    });
}
exports.removeFavourite = removeFavourite;
/**############################################################################
 *
 * Funcion para obtener lista de favoritos de un usuario
 * @param {string} userId id del usuario
 * @returns {array} lista de los favoritos del usuario
 */
function getUserFavourites(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM favourites WHERE user_id = ?';
        const [favouritesData] = yield infrastructure_1.database.query(query, userId);
        const favourites = [];
        for (const favourite of favouritesData) {
            const product = yield products_repository_1.getSingleProduct(favourite.product_id);
            favourites.push(product);
        }
        return favourites;
    });
}
exports.getUserFavourites = getUserFavourites;
/**
 *
 * Funcion para obtener favoritos por id de favorito
 * @param {string} favouriteId id del favorito
 * @returns {object} objeto con la informacion del favorito
 */
function getFavouriteById(favouriteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM favourites WHERE id = ?';
        const [favourite] = yield infrastructure_1.database.query(query, favouriteId);
        return favourite[0];
    });
}
exports.getFavouriteById = getFavouriteById;
//# sourceMappingURL=favourites-repository.js.map