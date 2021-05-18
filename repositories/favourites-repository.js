const { database } = require('../infrastructure');

/**############################################################################
 *
 * Funcion para comprobar si el producto ya ha sido añadido como favorito
 * @param {Number} userId id del usuario
 * @param {Number} productId id del producto
 * @returns {Object} objeto con la informacion del favorito
 */

async function userHasFavourite(userId, productId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ? AND product_id = ?';

  const [favourite] = await database.pool.query(query, [userId, productId]);

  return favourite[0];
}

/**############################################################################
 *
 * Funcion para añadir favorito
 * @param {Number} userId id del usuario
 * @param {Number} productId id del producto
 * @returns {Object} objeto con la informacion del favorito
 */

async function addFavourite(userId, productId) {
  const query = 'INSERT INTO favourites (product_id, user_id) VALUES (?,?)';
  const [result] = await database.pool.query(query, [productId, userId]);

  return getFavouriteById(result.insertId);
}

/**############################################################################
 *
 * Funcion para eliminar un producto de favoritos
 * @param {Number} userId id del usuario
 * @param {Number} productId id del producto
 * @returns {Array} lista actualizada de los favoritos del usuario
 */

async function removeFavourite(userId, productId) {
  const query = 'DELETE FROM favourites WHERE user_id = ? AND product_id = ?';
  await database.pool.query(query, [userId, productId]);

  return getUserFavourites(userId);
}

/**############################################################################
 *
 * Funcion para obtener lista de favoritos de un usuario
 * @param {Number} userId id del usuario
 * @returns {Array} lista de los favoritos del usuario
 */

async function getUserFavourites(userId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ?';
  const [favourites] = await database.pool.query(query, userId);

  return favourites;
}

/**
 *
 * Funcion para obtener favoritos por id de favorito
 * @param {Number} favouriteId id del favorito
 * @returns {object} objeto con la informacion del favorito
 */

async function getFavouriteById(favouriteId) {
  const query = 'SELECT * FROM favourites WHERE id = ?';
  const [favourite] = await database.pool.query(query, favouriteId);

  return favourite[0];
}

module.exports = {
  userHasFavourite,
  addFavourite,
  removeFavourite,
  getUserFavourites,
  getFavouriteById,
};
