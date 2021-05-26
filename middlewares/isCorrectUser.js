const { findUserById } = require('../repositories/users-repository');

/**
 * Funcion para devolver error en caso de que el token de autenticacion no
 * corresponda con la peticion
 * @param {string} reqParam id del usuario en la ruta como req.param
 * @param {string} reqAuth id del usuario extraido del JWT
 */
function isCorrectUser(reqParam, reqAuth) {
  // Comprobar que el usuario con id del req param existe
  const user = findUserById(reqParam);
  if (!user) {
    const err = new Error('No existe usuario con ese email');
    err.code = 401;
    throw err;
  }

  // Comprobar que el id del parametro y el del usuario que intenta acceder son el mismo
  if (Number(reqParam) !== reqAuth) {
    const err = new Error('No tienes los permisos para acceder a este lugar');
    err.code = 403;
    throw err;
  }
}

module.exports = { isCorrectUser };
