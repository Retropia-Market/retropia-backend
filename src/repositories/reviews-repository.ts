import { database } from '../infrastructure';
import { findImageById } from './images-repository';

/**
 * Funcion para obtener la review de un producto
 * @param {string} id id del producto del req.param
 * @returns JSON con la info de la review
 */
const getReviewByProductId = async (id) => {
    const getReviewByProductQuery =
        'SELECT * FROM reviews WHERE product_id = ?';
    const [getReviewbyProductData] = await database.query(
        getReviewByProductQuery,
        [id]
    );
    return getReviewbyProductData[0];
};

/**
 * Función para añadir review a un producto
 * @param {object} data datos de la review a añadir
 * @param {string} productId id del producto sobre el que comentar
 * @returns JSON con la info de la review creada
 */
const addReviewToProduct = async (data, productId, userId) => {
    const addReviewToProductQuery =
        'INSERT INTO reviews (product_id, user_id, review_rating, review_text, review_date) VALUES (?, ?, ?, ?, curdate())';
    await database.query(addReviewToProductQuery, [
        productId,
        userId,
        data.review_rating,
        data.review_text,
    ]);
    const reviewDone = await getReviewByProductId(productId);
    return reviewDone;
};

/**
 * Funcion para actualizar una review
 * @param {object} data info con la que actualizar la review
 * @param {string} productId id del producto objetivo
 * @returns JSON con la info de la review actualizada
 */
const updateReview = async (data, productId) => {
    //TODO - DEFINE FUNC
    const updateReviewToProductQuery =
        'UPDATE reviews SET review_rating = ?, review_text = ? WHERE product_id = ?';
    await database.query(updateReviewToProductQuery, [
        data.review_rating,
        data.review_text,
        productId,
    ]);
    const reviewDone = await getReviewByProductId(productId);
    return reviewDone;
};

/**
 * Funcion para eliminar la review sobre un producto
 * @param {string} productId id del producto objetivo
 */
const deleteReview = async (productId) => {
    const deleteReviewQuery = 'DELETE FROM reviews where product_id = ?';
    await database.query(deleteReviewQuery, [productId]);
};

/**
 * Funcion para calcular la media de valoriaciones de un usuario
 * @param {string} userId
 * @returns {number | string} valoracion media del usuario
 */
const getAvgReviewScoreByUser = async (userId) => {
    const queryGetRating =
        'SELECT COUNT(reviews.id) as total_review, AVG(reviews.review_rating) AS review_average, products.seller_id as user_id FROM reviews JOIN products ON products.id = reviews.product_id WHERE products.seller_id = ? GROUP BY products.seller_id';
    const [result] = await database.query(queryGetRating, userId);
    return result[0];
};

const getMadeReviews = async (userId) => {
    const queryMade =
        'SELECT products.id AS product_id, products.seller_id , users.username as seller_name, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views, reviews.id AS review_id, reviews.review_rating, reviews.review_text, reviews.review_date, reviews.user_id AS reviewer_id FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN reviews ON reviews.product_id = products.id INNER JOIN users ON users.id = products.seller_id WHERE reviews.user_id = ?';
    const [result]: any = await database.query(queryMade, userId);
    for (const prod of result) {
        const images: any = await findImageById(prod.product_id);
        prod.images = [...images];
    }
    return result;
};

const getReceivedReviews = async (userId) => {
    const queryMade =
        'SELECT products.id AS product_id, products.seller_id, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views, reviews.id AS review_id, reviews.review_rating, reviews.review_text, reviews.review_date, reviews.user_id AS reviewer_id, users.username as reviewer_name FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN reviews ON reviews.product_id = products.id INNER JOIN users ON users.id = reviews.user_id WHERE products.seller_id = ?';
    const [result]: any = await database.query(queryMade, userId);

    for (const prod of result) {
        const images: any = await findImageById(prod.product_id);
        prod.images = [...images];
    }

    //Reviews han sido vistas

    if (result.length >= 1) {
        const productsIds = result.map((p) => p.product_id);
        let productsQuery = 'UPDATE reviews SET watched = 1 WHERE';
        for (let i = 0; i < productsIds.length; i++) {
            if (i == productsIds.length - 1) {
                productsQuery =
                    productsQuery + ` product_id = ${productsIds[i]};`;
            } else {
                productsQuery =
                    productsQuery + ` product_id = ${productsIds[i]} OR `;
            }
        }
        await database.query(productsQuery);
    }

    return result;
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
