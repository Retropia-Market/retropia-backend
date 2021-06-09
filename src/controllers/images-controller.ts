const fs = require('fs').promises;
import { imagesRepository } from '../repositories';

import { RequestHandler } from 'express';
import { ErrnoException } from '../models/Error';

// TODO: REVISAR TIPOS
const deleteImageById: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.auth;

    const image = await imagesRepository.findImageByImageId(id);

    if (!image) {
      const err: ErrnoException = new Error('No existe la imagen');
      err.code = 404;

      throw err;
    }

    if (userId !== image.user_id) {
      const err: ErrnoException = new Error(
        'Sin permisos, sólo el dueño de la venta o el admin puede borrar'
      );
      err.code = 403;

      throw err;
    }

    await imagesRepository.deleteImageById(id);
    await fs.unlink(image.url);

    res.status(204);
    res.send();
  } catch (err) {
    next(err);
  }
};

export { deleteImageById };
