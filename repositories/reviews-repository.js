const { database } = require('../infrastructure');

/**
 * Funcion para obtener la review de un producto
 * @param {string} id id del producto del req.param
 * @returns JSON con la info de la review
 */
const getReviewByProductId = async (id) => {
  const getReviewByProductQuery =
    'SELECT products.review_rating, products.review_text, products.review_date FROM products WHERE id = ?';
  const [getReviewbyProductData] = await database.pool.query(
    getReviewByProductQuery,
    id
  );
  return getReviewbyProductData;
};

/**
 * Función para añadir review a un producto
 * @param {object} data datos de la review a añadir
 * @param {string} productId id del producto sobre el que comentar
 * @returns JSON con la info de la review creada
 */
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

/**
 * Funcion para actualizar una review
 * @param {object} data info con la que actualizar la review
 * @param {string} productId id del producto objetivo
 * @returns JSON con la info de la review actualizada
 */
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

/**
 * Funcion para eliminar la review sobre un producto
 * @param {string} productId id del producto objetivo
 */
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

/**
 * Funcion para calcular la media de valoriaciones de un usuario
 * @param {string} userId
 * @returns {number | string} valoracion media del usuario
 */
const getAvgReviewScoreByUser = async (userId) => {
  const queryGetRating =
    'SELECT AVG(review_rating) AS review_average, seller_id FROM products WHERE seller_id = ?';
  const [result] = await database.pool.query(queryGetRating, userId);
  return result[0];
};

module.exports = {
  getReviewByProductId,
  addReviewToProduct,
  updateReview,
  deleteReview,
  getAvgReviewScoreByUser,
};
