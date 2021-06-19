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

async function getUserByUsername(username) {
  const [results] = await database.query(
    'SELECT * FROM users WHERE username = ?',
    username
  );
  return results[0];
}

async function getUserByPassCode(code) {
  const [results] = await database.query(
    'SELECT * FROM users WHERE password_token = ?',
    code
  );

  return results[0];
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
  const mandatory = {
    username: data.username,
    email: data.email,
    password: data.password,
  };
  const optional = Object.keys(data).reduce((acc, field) => {
    !mandatory[field] ? (acc[field] = data[field]) : acc;
    return acc;
  }, {});

  const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
  const [{ insertId }]: any = await database.query(query, [
    mandatory.username,
    mandatory.email,
    mandatory.password,
  ]);

  for (const field in optional) {
    if (optional[field])
      await database.query(
        `UPDATE users SET ${field} = '${optional[field]}' WHERE id = '${insertId}'`
      );
  }

  return getUserByEmail(mandatory.email);
}

const emailVerification = async (email_code) => {
  const [results] = await database.query(
    'SELECT * FROM users WHERE email_code = ?',
    email_code
  );

  return results[0];
};

const validateUser = async (id) => {
  const [results] = await database.query(
    'UPDATE users SET verified = 1 WHERE id = ?',
    id
  );

  return findUserById(id);
};

const generatePassToken = async (id, token) => {
  await database.query('UPDATE users SET password_token = ? WHERE id = ?', [
    token,
    id,
  ]);

  return getUserById(id);
};

const revokePassToken = async (id) => {
  await database.query(
    'UPDATE users SET password_token = null WHERE id = ?',
    id
  );

  return getUserById(id);
};

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
  if (image) !image.includes('google') ? await fs.unlink(image) : image;

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

export {
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getUserByPassCode,
  findUserById,
  registerUser,
  emailVerification,
  validateUser,
  generatePassToken,
  revokePassToken,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
};
