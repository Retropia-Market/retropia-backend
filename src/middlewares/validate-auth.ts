import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

import { database } from '../infrastructure';
import { ErrnoException } from '../models/Error';

// TODO: REVISAR TIPOS
export const validateAuthorization: RequestHandler = async (
  req: any,
  res,
  next
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      const error: ErrnoException = new Error('Authorization header required');
      error.code = 401;
      throw error;
    }

    const token = authorization.slice(7, authorization.length);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Comprobamos que el usuario para el que fue emitido
    // el token todavía existe.
    const query = 'SELECT * FROM users WHERE id = ?';
    const [user] = await database.query(query, decodedToken.id);

    if (!user) {
      const error: ErrnoException = new Error('El usuario ya no existe');
      error.code = 401;
      throw error;
    }

    req.auth = decodedToken;
    next();
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
};
