const Joi = require('joi');

const { bidsRepository, productsRepository } = require('../repositories');

async function placeBid(req, res, next) {
  try {
    const { id } = req.auth;
    const data = req.body;
    const { productId } = req.params;

    const schema = Joi.object({
      message: Joi.string().max(500).required(),
      bidPrice: Joi.number().required(),
    });
    await schema.validateAsync(data);

    const product = await productsRepository.findProductById(productId);
    if (!product) {
      const err = new Error('No se ha encontrado el producto');
      err.code = 404;
      throw err;
    }
    if (product.seller_id === id) {
      const err = new Error(
        'No puedes hacer ofertas a objetos que te pertenecen'
      );
      err.code = 403;
      throw err;
    }

    const bidExist = await bidsRepository.checkBidData(id, productId);
    if (bidExist.length) {
      const err = new Error('Ya has ofertado por este producto.');
      err.code = 409;
      throw err;
    }

    await bidsRepository.placeBid(id, productId, data.bidPrice, data.message);
    res.send({ Status: 'OK', Message: 'Oferta realizada con exito.' });
  } catch (error) {
    next(error);
  }
}

async function acceptBid(req, res, next) {
  try {
    const { id } = req.auth;
    const { bidId } = req.params;
    const bidAccepted = await bidsRepository.getBidById(bidId);

    const product = await productsRepository.findProductById(
      bidAccepted.product_id
    );

    if (id !== product.seller_id) {
      const err = new Error('No tienes permisos para aceptar esta oferta');
      err.code = 401;
      throw err;
    }

    if (bidAccepted.bid_status === 'aceptado') {
      const err = new Error('Ya has aceptado la oferta por este producto.');
      err.code = 409;
      throw err;
    }
    if (bidAccepted.bid_status === 'rechazado') {
      const err = new Error('Ya has rechazado la oferta por este producto.');
      err.code = 409;
      throw err;
    }

    const productBids = await bidsRepository.getProductsBidsById(product.id);
    for (const bid of productBids) {
      bidsRepository.declineBid(bid.id);
    }

    await bidsRepository.acceptBid(bidId);
    await productsRepository.updateSaleStatus('vendido', product.id);

    res.send({ Status: 'OK', Message: 'Oferta aceptada con exito.' });
  } catch (error) {
    next(error);
  }
}

async function declineBid(req, res, next) {
  try {
    const { id } = req.auth;
    const { bidId } = req.params;
    const bid = await bidsRepository.getBidById(bidId);

    const product = await productsRepository.findProductById(bid.product_id);

    if (id !== product.seller_id) {
      const err = new Error('No tienes permisos para aceptar esta oferta');
      err.code = 401;
      throw err;
    }

    if (bid.bid_status === ('rechazado' || 'aceptado')) {
      const err = new Error('Esta oferta ya se ha respondido');
      err.code = 409;
      throw err;
    }

    const updatedBid = await bidsRepository.declineBid(bidId);

    res.send({
      Status: 'OK',
      Message: 'Oferta rechaza con exito',
      updatedBid,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteBidById(req, res, next) {
  try {
    const { id } = req.auth;
    const { bidId } = req.params;
    const bidData = await bidsRepository.getBidById(bidId);

    if (!bidData.length) {
      const err = new Error('La oferta no existe');
      err.code = 404;
      throw err;
    }

    if (bidData[0].user_id !== id) {
      const err = new Error('No tienes permisos para borrar esta oferta');
      err.code = 401;
      throw err;
    }

    await bidsRepository.deleteBid(bidId);
    res.status = 204;
    res.send({ Status: 'OK', Message: 'Oferta producto eliminada con exito.' });
  } catch (error) {
    next(error);
  }
}

async function modifyBidById(req, res, next) {
  try {
    const { id } = req.auth;
    const data = req.body;
    const { bidId } = req.params;
    const bidData = await bidsRepository.getBidById(bidId);

    console.log(data);

    if (!bidData.length) {
      const err = new Error('La oferta no existe');
      err.code = 404;
      throw err;
    }

    if (bidData[0].user_id !== id) {
      const err = new Error('No tienes permisos para modificar esta oferta');
      err.code = 401;
      throw err;
    }

    await bidsRepository.modifyBid(bidId, data);

    res.status = 204;
    res.send({
      Status: 'OK',
      Message: 'Oferta de producto modificada con exito.',
    });
  } catch (error) {
    next(error);
  }
}

async function getUserBidsById(req, res, next) {
  try {
    const { userId } = req.params;
    const bids = await bidsRepository.getUserBidsById(userId);
    res.send({ bids });
  } catch (error) {
    next(error);
  }
}

async function getProductsBidsById(req, res, next) {
  try {
    const { productId } = req.params;
    const bids = await bidsRepository.getProductsBidsById(productId);
    res.send({ bids });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  declineBid,
  acceptBid,
  placeBid,
  deleteBidById,
  modifyBidById,
  getUserBidsById,
  getProductsBidsById,
};
