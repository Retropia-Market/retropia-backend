const fs = require('fs').promises;
const { database } = require('../infrastructure');

/**############################################################################
 *
 * Funcion para obtener todos los usuarios registrados en la pagina
 * @returns {Array} users registrados
 */

async function getUsers() {
  const query = 'SELECT * FROM users';
  const [users] = await database.pool.query(query);

  return users;
}

/**############################################################################
 *
 * Funcion para buscar usuario por direccion de correo electronico
 * @param {String} email email del usuario a buscar
 * @returns {Object} usuario con email proporcionado
 */

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [users] = await database.pool.query(query, email);

  return users[0];
}

/**############################################################################
 *
 * Funcion para obtener usuario por id de usuario
 * @param {Number} id id del usuario a buscar
 * @returns {Object} usuario con id proporcionado
 */

async function findUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [users] = await database.pool.query(query, id);

  return users[0];
}

/**############################################################################
 *
 * Funcion para registrar usuario
 * @param {Object} data objeto con la informacion obligatoria de registro
 * @returns {Object} objeto con la informacion del usuario creado
 */

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

/**############################################################################
 *
 * Funcion para actualizar el perfil de un usuario
 * @param {Object} data objecto con la nueva informacion del usuario
 * @param {Number} id id del usuario
 * @returns {Object} objeto del usuario actualizado
 */

async function updateProfile(data, id) {
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

/**############################################################################
 *
 * Funcion para actualizar la password de un usuario
 * @param {String} hashedPassword hash de la nueva password proporcionada
 * @param {Number} id id del usuario
 * @returns {Object} del objeto actualizado
 */

async function updatePassword(hashedPassword, id) {
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
  await database.pool.query(updatePasswordQuery, [hashedPassword, id]);

  return findUserById(id);
}

/**############################################################################
 *
 * Funcion para actualizar la imagen de un usuario
 * @param {Number} id id del usuario
 * @param {String} imagePath
 * @returns {object} objeto del usuario actualizado
 */

async function updateImage(id, imagePath) {
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

/**############################################################################
 *
 * Funcion para eliminar la imagen de un usuario
 * @param {Number} id id del usuario
 * @returns {Object} objecto con el usuario actualizado
 */

async function deleteImage(id) {
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
