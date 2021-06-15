const fs = require('fs').promises;
import { database } from '../infrastructure';

/**############################################################################
 *
 * Funcion para obtener todos los usuarios registrados en la pagina
 * @returns {array} users registrados
 */

const getUsers = async () => {
  const query = 'SELECT * FROM users';
  const [users] = await database.query(query);

  return users;
};

/**#############################################################################
 *
 * Funcion para obtener la informacion del usuario
 * @param {string} id
 * @returns {object} informacion del usuario
 */

async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [user] = await database.query(query, id);

  return user[0];
}

/**############################################################################
 *
 * Funcion para buscar usuario por direccion de correo electronico
 * @param {string} email email del usuario a buscar
 * @returns {object} usuario con email proporcionado
 */

async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [users] = await database.query(query, email);

  return users[0];
}

/**############################################################################
 *
 * Funcion para obtener usuario por id de usuario
 * @param {string} id id del usuario a buscar
 * @returns {object} usuario con id proporcionado
 */

async function findUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [users] = await database.query(query, id);

  return users[0];
}

/**############################################################################
 *
 * Funcion para registrar usuario
 * @param {object} data objeto con la informacion obligatoria de registro
 * @returns {object} objeto con la informacion del usuario creado
 */

async function registerUser(data) {
  const query =
    'INSERT INTO users (username, password, email, firstname, lastname) VALUES (?,?,?,?,?)';
  await database.query(query, [
    data.username,
    data.password,
    data.email,
    // data?.birthDate,
    data.firstName,
    data.lastName,
  ]);

  return getUserByEmail(data.email);
}

/**############################################################################
 *
 * Funcion para actualizar el perfil de un usuario
 * @param {object} data objecto con la nueva informacion del usuario
 * @param {string} id id del usuario
 * @returns {object} objeto del usuario actualizado
 */

async function updateProfile(data, id) {
  const replaceNotNull = async (column, value, userId = id) => {
    /** se asume que column es la propiedad cuyo valor se quiere cambiar en la base de datos,
     * value el nuevo valor que se le quiere dar,
     * y userId el id de usuario a cambiar la informacion.
     */

    if (value !== undefined && value.length) {
      const updateProfileQuery = `UPDATE users SET ${column} = '${value}' WHERE id = '${userId}'`;
      await database.query(updateProfileQuery);
    }
  };

  for (const property in data) await replaceNotNull(property, data[property]);

  return findUserById(id);
}

/**############################################################################
 *
 * Funcion para actualizar la password de un usuario
 * @param {string} hashedPassword hash de la nueva password proporcionada
 * @param {string} id id del usuario
 * @returns {object} del objeto actualizado
 */

async function updatePassword(hashedPassword, id) {
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
  await database.query(updatePasswordQuery, [hashedPassword, id]);

  return findUserById(id);
}

/**############################################################################
 *
 * Funcion para actualizar la imagen de un usuario
 * @param {string} id id del usuario
 * @param {string} imagePath
 * @returns {object} objeto del usuario actualizado
 */

async function updateImage(id, imagePath) {
  // obtener path a la imagen anterior del usuario
  const searchQuery = 'SELECT image FROM users WHERE id = ?';
  const [[{ image }]]: any = await database.query(searchQuery, id);
  // borrar imagen anterior si existe
  image !== null ? await fs.unlink(image) : image;

  // acualizar la path a la imagen en la info del usuario
  const updateQuery = 'UPDATE users SET image = ? WHERE id = ?';
  await database.query(updateQuery, [imagePath, id]);

  return findUserById(id);
}

/**############################################################################
 *
 * Funcion para eliminar la imagen de un usuario
 * @param {string} id id del usuario
 * @returns {object} objecto con el usuario actualizado
 */

async function deleteImage(id) {
  // Obtener path a la imagen del usuario
  const searchQuery = 'SELECT image FROM users WHERE id = ?';
  const [[{ image }]]: any = await database.query(searchQuery, id);
  // borrar la imagen si existe
  image !== null ? await fs.unlink(image) : image;

  // eliminar path vacia de la informacion del usuario
  const updateQuery = 'UPDATE users SET image = null WHERE id = ?';
  await database.query(updateQuery, id);

  return findUserById(id);
}

async function makeExternalUser(id) {
  await database.query('UPDATE users SET external_user = 1 WHERE id = ?', id);

  return findUserById(id);
}

export {
  getUsers,
  getUserById,
  getUserByEmail,
  findUserById,
  registerUser,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
  makeExternalUser,
};
