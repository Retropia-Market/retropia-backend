const { database } = require('../infrastructure');

const getReviewByProductId = async (id) => {
    const getReviewByProductQuery =
        'SELECT products.review_rating, products.review_text, products.review_date FROM products WHERE id = ?';
    const [getReviewbyProductData] = await database.pool.query(
        getReviewByProductQuery,
        id
    );
    return getReviewbyProductData;
};

const addReviewToProduct = async (data, productId) => {
    const addReviewToProductQuery =
        'UPDATE products SET review_rating = ?, review_text = ?, review_date = curdate() WHERE id = ?';
    await database.pool.query(addReviewToProductQuery, [
        data.review_rating,
        data.review_text,
        productId,
    ]);
    const reviewDone = await getReviewByProductId(productId);
    return reviewDone;
};

const updateReview = async (data, productId) => {
    //TODO - DEFINE FUNC
    const updateReviewToProductQuery =
        'UPDATE products SET review_rating = ?, review_text = ? WHERE id = ?';
    await database.pool.query(updateReviewToProductQuery, [
        data.review_rating,
        data.review_text,
        productId,
    ]);
    const reviewDone = await getReviewByProductId(productId);
    return reviewDone;
};

const deleteReview = async (productId) => {
    const deleteRev = null;
    const addReviewToProductQuery =
        'UPDATE products SET review_rating = ?, review_text = ?, review_date = ? WHERE id = ?';
    await database.pool.query(addReviewToProductQuery, [
        deleteRev,
        deleteRev,
        deleteRev,
        productId,
    ]);
};

module.exports = {
    getReviewByProductId,
    addReviewToProduct,
    updateReview,
    deleteReview,
};
