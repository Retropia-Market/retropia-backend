import { ErrnoException } from '../models/Error';

// TODO: REVISAR TIPOS
import { findUserById } from '../repositories/users-repository';

/**
 * Funcion para devolver error en caso de que el token de autenticacion no
 * corresponda con la peticion
 * @param {string} reqParam id del usuario en la ruta como req.param
 * @param {string} reqAuth id del usuario extraido del JWT
 */
export const isCorrectUser = async (reqParam, reqAuth) => {
  try {
    // Comprobar que el usuario con id del req param existe
    const user = await findUserById(reqParam);
    if (!user) {
      const err: ErrnoException = new Error('No existe el usuario');
      err.code = 401;
      throw err;
    }

    // Comprobar que el id del parametro y el del usuario que intenta acceder son el mismo
    if (Number(reqParam) !== reqAuth) {
      const err: ErrnoException = new Error(
        'No tienes los permisos para acceder a este lugar'
      );
      err.code = 403;
      throw err;
    }
  } catch (error) {
    console.log(error);
  }
};
