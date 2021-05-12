const fs = require('fs').promises;
const { database } = require('../infrastructure');

async function getUsers() {
  const query = 'SELECT * FROM users';
  const [users] = await database.pool.query(query);

  return users;
}

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [users] = await database.pool.query(query, email);

  return users[0];
}

async function findUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [users] = await database.pool.query(query, id);

  return users[0];
}

async function registerUser(data) {
  const query =
    'INSERT INTO users (username, password, email, birth_date, firstname, lastname) VALUES (?,?,?,?,?,?)';
  await database.pool.query(query, [
    data.username,
    data.password,
    data.email,
    data.birthDate,
    data.firstName,
    data.lastName,
  ]);

  return findUserByEmail(data.email);
}

async function updateProfile(data, id) {
  /** espera data como objeto de los datos de usuario recogidos del body
   *  e id como el id del usuario recogido del token de autenticacion
   */

  const replaceNotNull = async (column, value, userId = id) => {
    /** se asume que column es la propiedad cuyo valor se quiere cambiar en la base de datos,
     * value el nuevo valor que se le quiere dar,
     * y userId el id de usuario a cambiar la informacion.
     */

    if (value !== undefined) {
      const updateProfileQuery = `UPDATE users SET ${column} = '${value}' WHERE id = '${userId}'`;
      await database.pool.query(updateProfileQuery);
    }
  };

  for (const property in data) await replaceNotNull(property, data[property]);

  return findUserById(id);
}

async function updatePassword(hashedPassword, id) {
  /**
   * Se espera el hash de la password y el id del usuario
   */
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
  await database.pool.query(updatePasswordQuery, [hashedPassword, id]);

  return findUserById(id);
}

async function updateImage(id, imagePath) {
  /** La funcion espera como parametros el id del usuario y la ruta
   *  en la que guardar la imagen con su nombre incluido como uuid
   */
  // obtener path a la imagen anterior del usuario
  const searchQuery = 'SELECT image FROM users WHERE id = ?';
  const [[{ image }]] = await database.pool.query(searchQuery, id);
  // borrar imagen anterior si existe
  image !== null ? await fs.unlink(image) : image;

  // acualizar la path a la imagen en la info del usuario
  const updateQuery = 'UPDATE users SET image = ? WHERE id = ?';
  await database.pool.query(updateQuery, [imagePath, id]);

  return findUserById(id);
}

async function deleteImage(id) {
  /**
   * Se espera como parametro el id del usuario al que borrar la imagen
   */

  // Obtener path a la imagen del usuario
  const searchQuery = 'SELECT image FROM users WHERE id = ?';
  const [[{ image }]] = await database.pool.query(searchQuery, id);
  // borrar la imagen si existe
  image !== null ? await fs.unlink(image) : image;

  // eliminar path vacia de la informacion del usuario
  const updateQuery = 'UPDATE users SET image = null WHERE id = ?';
  await database.pool.query(updateQuery, id);

  return findUserById(id);
}

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  registerUser,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
};
