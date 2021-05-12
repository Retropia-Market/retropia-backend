const { imagesRepository } = require('../repositories');

async function deleteImageById(req, res, next) {
    try {
        const { id } = req.params;
        const { id: userId } = req.auth;

        const image = await imagesRepository.findImageById(id);

        if (!image) {
            const err = new Error('No existe la imagen');
            err.code = 404;

            throw err;
        }

        if (userId !== image.user_id && role !== 'admin') {
            const err = new Error(
                'Sin permisos, sólo el dueño de la venta o el admin puede borrar'
            );
            err.code = 403;

            throw err;
        }

        await imagesRepository.deleteImageById(id);

        res.status(204);
        res.send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    deleteImageById,
};
