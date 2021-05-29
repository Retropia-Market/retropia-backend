const Joi = require('joi');
const fs = require('fs').promises;

//TODO - NORMALIZE NAMES && COMMENT

const { productsRepository, imagesRepository } = require('../repositories');

const getCatalogue = async (req, res, next) => {
    try {
        const products = await productsRepository.getCatalogue(
            req.query ? req.query : ''
        );
        res.send(products);
    } catch (error) {
        next(error);
    }
};

const getCatalogueByUserId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const schema = Joi.number().positive().min(1);
        await schema.validateAsync(id);
        const productsByUserId = await productsRepository.getCatalogueByUserId(
            id
        );
        res.send(productsByUserId);
    } catch (error) {
        next(error);
    }
};

const addProductToSellList = async (req, res, next) => {
    try {
        const { id } = req.auth;
        const { files } = req;
        const schema = Joi.object({
            name: Joi.string().required(),
            status: Joi.string().required(),
            product_type: Joi.string().required(),
            location: Joi.string().required(),
            price: Joi.number().required().min(0).max(100000),
            description: Joi.string(),
            subcategory: Joi.string(),
        });
        await schema.validateAsync(req.body);

        const createProduct = await productsRepository.addProductToSellList(
            req.body,
            id
        );

        for (file of files) {
            const url = `productImages/${id}/${file.filename}`;
            await imagesRepository.createImage(url, createProduct.id);
        }

        const finalProduct = await productsRepository.findProductById(
            createProduct.id
        );

        res.status(201);
        res.send(finalProduct);
    } catch (error) {
        next(error);
    }
};

const addMoreImagesToProduct = async (req, res, next) => {
    try {
        const { id: userId } = req.auth;
        const { files } = req;
        const { id } = req.params;

        const searchProduct = await productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;

            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error(
                'No tienes permiso para actualizar este producto'
            );
            errorAuth.code = 403;
            throw errorAuth;
        }
        if (searchProduct.sale_status === 'vendido') {
            const errorAlreadySold = new Error(
                'No puedes modificar productos ya vendidos'
            );
            errorAlreadySold.code = 403;
            throw errorAlreadySold;
        }

        for (image of files) {
            const url = `static/images/${id}/${image.filename}`;
            const addImage = await imagesRepository.createImage(url, id);
        }
        res.status(201);
        res.send('Imagenes subidas correctamente!');
    } catch (error) {
        next(error);
    }
};

const removeProductbyId = async (req, res, next) => {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = Joi.object({
            id: Joi.number().min(1),
        });
        await schema.validateAsync({ id });
        const searchProduct = await productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;

            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error(
                'No tienes permiso para borrar este producto'
            );
            errorAuth.code = 403;
            throw errorAuth;
        }
        const images = await imagesRepository.findImageById(id);
        images.forEach(async (image) => {
            const { url } = image;
            await fs.unlink(url);
        });
        await productsRepository.removeProductById(id);

        res.status(204);
        res.send();
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const schema = Joi.object({
            name: Joi.string().min(1).max(20),
            status: Joi.string().min(1).max(10),
            location: Joi.string().min(1),
            price: Joi.number().min(1).max(100000),
            description: Joi.string().min(1).max(500),
            subcategory: Joi.string().min(1).max(15),
        });
        await schema.validateAsync(req.body);
        const searchProduct = await productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;

            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error(
                'No tienes permiso para actualizar este producto'
            );
            errorAuth.code = 403;
            throw errorAuth;
        }
        if (searchProduct.sale_status === 'vendido') {
            const errorAlreadySold = new Error(
                'No puedes modificar productos ya vendidos'
            );
            errorAlreadySold.code = 403;
            throw errorAlreadySold;
        }
        const product = await productsRepository.updateProduct(req.body, id);
        res.send(product);
    } catch (error) {
        next(error);
    }
};

const updateSaleStatus = async (req, res, next) => {
    try {
        const { id: userId } = req.auth;
        const { id } = req.params;
        const { sale_status } = req.body;
        const schema = Joi.object({
            sale_status: Joi.string().required(),
        });
        await schema.validateAsync({ sale_status });
        const searchProduct = await productsRepository.findProductById(id);
        if (!searchProduct) {
            const err = new Error('No existe el producto');
            err.code = 404;

            throw err;
        }
        if (userId != searchProduct.seller_id) {
            const errorAuth = new Error(
                'No tienes permiso para actualizar este producto'
            );
            errorAuth.code = 403;
            throw errorAuth;
        }

        const update = await productsRepository.updateSaleStatus(
            sale_status,
            id
        );
        res.send(update);
    } catch (error) {
        next(error);
    }
};

const getSingleProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await productsRepository.getSingleProduct(id);

        if (!product) {
            const err = new Error('No existe el producto');
            err.code = 404;

            throw err;
        }
        res.send(product);
    } catch (error) {
        next(error);
    }
};

const searchCatalogue = async (req, res, next) => {
    try {
        const { term } = req.params;
        const data = await productsRepository.searchCatalogue(term);
        res.send(data);
    } catch (error) {
        next(error);
    }
};

const getTopProducts = async (req, res, next) => {
    try {
        const data = await productsRepository.getTopProducts();
        res.send(data);
    } catch (error) {
        next(error);
    }
};

const getSimilarProducts = async (req, res, next) => {
    try {
        const { subcategory } = req.params;
        const schema = Joi.object({
            subcategory: Joi.string().required(),
        });
        await schema.validateAsync({ subcategory });
        const data = await productsRepository.getSimilarProducts(subcategory);
        res.send(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addProductToSellList,
    getCatalogue,
    removeProductbyId,
    updateProduct,
    getSingleProduct,
    updateSaleStatus,
    searchCatalogue,
    addMoreImagesToProduct,
    getCatalogueByUserId,
    getTopProducts,
    getSimilarProducts,
};
