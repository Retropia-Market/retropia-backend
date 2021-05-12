const { database } = require('../infrastructure');

async function getFavouriteById(id) {
  const query = 'SELECT * FROM favourites where id =?';

  [favourite] = await database.pool.query(query, id);

  return favourite[0];
}

async function userHasFavourite(userId, productId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ? AND product_id = ?';

  const [favourite] = await database.pool.query(query, [userId, productId]);

  return favourite[0];
}

async function addFavourite(userId, productId) {
  const query = 'INSERT INTO favourites (product_id, user_id) VALUES (?,?)';
  const [result] = await database.pool.query(query, [productId, userId]);

  return getFavouriteById(result.insertId);
}

async function removeFavourite(userId, productId) {
  const query = 'DELETE FROM favourites WHERE user_id = ? AND product_id = ?';
  await database.pool.query(query, [userId, productId]);

  return true;
}

async function getUserFavourites(userId) {
  const query = 'SELECT * FROM favourites WHERE user_id = ?';
  const [favourites] = await database.pool.query(query, userId);

  return favourites;
}

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
