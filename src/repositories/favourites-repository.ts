import { database } from '../infrastructure';
import { getSingleProduct } from './products-repository';

/**############################################################################
 *
 * Funcion para comprobar si el producto ya ha sido añadido como favorito
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {object} objeto con la informacion del favorito
 */

async function userHasFavourite(userId, productId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ? AND product_id = ?';

  const [favourite] = await database.query(query, [userId, productId]);

  return favourite[0];
}

/**############################################################################
 *
 * Funcion para añadir favorito
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {object} objeto con la informacion del favorito
 */

async function addFavourite(userId, productId) {
  const query = 'INSERT INTO favourites (product_id, user_id) VALUES (?,?)';
  const [result] = await database.query(query, [productId, userId]);

  return getFavouriteById((result as { insertId }).insertId);
}

/**############################################################################
 *
 * Funcion para eliminar un producto de favoritos
 * @param {string} userId id del usuario
 * @param {string} productId id del producto
 * @returns {array} lista actualizada de los favoritos del usuario
 */

async function removeFavourite(userId, productId) {
  const query = 'DELETE FROM favourites WHERE user_id = ? AND product_id = ?';
  await database.query(query, [userId, productId]);

  return getUserFavourites(userId);
}

/**############################################################################
 *
 * Funcion para obtener lista de favoritos de un usuario
 * @param {string} userId id del usuario
 * @returns {array} lista de los favoritos del usuario
 */

async function getUserFavourites(userId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ?';
  const [favouritesData] = await database.query(query, userId);
  const favourites: {}[] = [];

  for (const favourite of favouritesData as { product_id }[]) {
    const product = await getSingleProduct(favourite.product_id);
    favourites.push(product);
  }

  return favourites;
}

/**
 *
 * Funcion para obtener favoritos por id de favorito
 * @param {string} favouriteId id del favorito
 * @returns {object} objeto con la informacion del favorito
 */

async function getFavouriteById(favouriteId) {
  const query = 'SELECT * FROM favourites WHERE id = ?';
  const [favourite] = await database.query(query, favouriteId);

  return favourite[0];
}

export {
  userHasFavourite,
  addFavourite,
  removeFavourite,
  getUserFavourites,
  getFavouriteById,
};
