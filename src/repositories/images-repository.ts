import database from '../infrastructure';

async function findImageById(id) {
  const query = 'SELECT * FROM products_img WHERE product_id = ?';
  const [images] = await database.pool.query(query, id);

  return images;
}
async function findImageByImageId(id) {
  const query = 'SELECT * FROM products_img WHERE id = ?';
  const [images] = await database.pool.query(query, id);

  return images[0];
}

async function createImage(url, product_id) {
  const query = 'INSERT INTO products_img (product_id, url) VALUES (?, ?)';
  const [result] = await database.pool.query(query, [product_id, url]);

  return findImageById(result.insertId);
}

async function deleteImageById(id) {
  const query = 'DELETE FROM products_img WHERE id = ?';

  return await database.pool.query(query, id);
}

export { deleteImageById, findImageById, createImage, findImageByImageId };
