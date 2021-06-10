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
exports.getReceivedReviews = exports.getMadeReviews = exports.getAvgReviewScoreByUser = exports.deleteReview = exports.updateReview = exports.addReviewToProduct = exports.getReviewByProductId = void 0;
const infrastructure_1 = require("../infrastructure");
const images_repository_1 = require("./images-repository");
/**
 * Funcion para obtener la review de un producto
 * @param {string} id id del producto del req.param
 * @returns JSON con la info de la review
 */
const getReviewByProductId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const getReviewByProductQuery = 'SELECT * FROM reviews WHERE product_id = ?';
    const [getReviewbyProductData] = yield infrastructure_1.database.query(getReviewByProductQuery, [id]);
    return getReviewbyProductData[0];
});
exports.getReviewByProductId = getReviewByProductId;
/**
 * Función para añadir review a un producto
 * @param {object} data datos de la review a añadir
 * @param {string} productId id del producto sobre el que comentar
 * @returns JSON con la info de la review creada
 */
const addReviewToProduct = (data, productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const addReviewToProductQuery = 'INSERT INTO reviews (product_id, user_id, review_rating, review_text, review_date) VALUES (?, ?, ?, ?, curdate())';
    yield infrastructure_1.database.query(addReviewToProductQuery, [
        productId,
        userId,
        data.review_rating,
        data.review_text,
    ]);
    const reviewDone = yield getReviewByProductId(productId);
    return reviewDone;
});
exports.addReviewToProduct = addReviewToProduct;
/**
 * Funcion para actualizar una review
 * @param {object} data info con la que actualizar la review
 * @param {string} productId id del producto objetivo
 * @returns JSON con la info de la review actualizada
 */
const updateReview = (data, productId) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO - DEFINE FUNC
    const updateReviewToProductQuery = 'UPDATE reviews SET review_rating = ?, review_text = ? WHERE product_id = ?';
    yield infrastructure_1.database.query(updateReviewToProductQuery, [
        data.review_rating,
        data.review_text,
        productId,
    ]);
    const reviewDone = yield getReviewByProductId(productId);
    return reviewDone;
});
exports.updateReview = updateReview;
/**
 * Funcion para eliminar la review sobre un producto
 * @param {string} productId id del producto objetivo
 */
const deleteReview = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteReviewQuery = 'DELETE FROM reviews where product_id = ?';
    yield infrastructure_1.database.query(deleteReviewQuery, [productId]);
});
exports.deleteReview = deleteReview;
/**
 * Funcion para calcular la media de valoriaciones de un usuario
 * @param {string} userId
 * @returns {number | string} valoracion media del usuario
 */
const getAvgReviewScoreByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryGetRating = 'SELECT COUNT(*) as total_review, AVG(review_rating) AS review_average, user_id FROM reviews WHERE user_id = ?';
    const [result] = yield infrastructure_1.database.query(queryGetRating, userId);
    return result[0];
});
exports.getAvgReviewScoreByUser = getAvgReviewScoreByUser;
const getMadeReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryMade = 'SELECT products.id AS product_id, products.seller_id , users.username as seller_name, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views, reviews.id AS review_id, reviews.review_rating, reviews.review_text, reviews.review_date, reviews.user_id AS reviewer_id FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN reviews ON reviews.product_id = products.id INNER JOIN users ON users.id = products.seller_id WHERE reviews.user_id = ?';
    const [result] = yield infrastructure_1.database.query(queryMade, userId);
    for (const prod of result) {
        const images = yield images_repository_1.findImageById(prod.product_id);
        prod.images = [...images];
    }
    return result;
});
exports.getMadeReviews = getMadeReviews;
const getReceivedReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryMade = 'SELECT products.id AS product_id, products.seller_id, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views, reviews.id AS review_id, reviews.review_rating, reviews.review_text, reviews.review_date, reviews.user_id AS reviewer_id, users.username as reviewer_name FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN reviews ON reviews.product_id = products.id INNER JOIN users ON users.id = reviews.user_id WHERE products.seller_id = ?';
    const [result] = yield infrastructure_1.database.query(queryMade, userId);
    for (const prod of result) {
        const images = yield images_repository_1.findImageById(prod.product_id);
        prod.images = [...images];
    }
    return result;
});
exports.getReceivedReviews = getReceivedReviews;
//# sourceMappingURL=reviews-repository.js.map