import { format } from 'date-fns';
import { bidResponse } from 'src/models/db-responses';

import { database } from '../infrastructure';

async function placeBid(userId, productId, bidPrice, message) {
  try {
    const eventDate = format(new Date(), 'yyyy/MM/dd');
    const query = `INSERT INTO bids (user_id, product_id, bid_price, bid_message, bid_date) VALUES ('${userId}','${productId}','${bidPrice}','${message}','${eventDate}');`;
    const [bids] = await database.query(query);
    return bids;
  } catch (error) {
    console.log(error);
  }
}

async function getBidsByProductId(productId) {
  try {
    const query = `SELECT * FROM bids WHERE product_id='${productId}';`;
    const [bids] = await database.query(query);
    return bids[0];
  } catch (error) {
    console.log(error);
  }
}

async function getBidById(bidId) {
  try {
    const query = `SELECT * FROM bids WHERE id='${bidId}';`;
    const [bids]: any = await database.query(query);
    return bids;
  } catch (error) {
    console.log(error);
  }
}

async function checkBidData(userId, productId) {
  try {
    const query = `SELECT * FROM bids WHERE user_id = '${userId}' AND product_id='${productId}';`;
    const [bids] = await database.query(query);
    return bids;
  } catch (error) {
    console.log(error);
  }
}

async function deleteBid(bidId) {
  try {
    const query = `DELETE FROM bids WHERE id = '${bidId}';`;
    const [deleted_bid] = await database.query(query);
    return deleted_bid;
  } catch (error) {
    console.log(error);
  }
}

async function modifyBid(bidId, data) {
  try {
    await Object.keys(data).forEach(async (bodyKey) => {
      if (bodyKey != 'subcategory') {
        const query = `UPDATE bids SET ${bodyKey} = '${data[bodyKey]}', edited_${bodyKey} = 1 WHERE id = ${bidId};`;
        await database.query(query);
      }
    });
    return await getBidById(bidId);
  } catch (error) {
    console.log(error);
  }
}

async function getUserBidsById(userId) {
  try {
    const query = `SELECT * FROM bids WHERE user_id = '${userId}' AND bid_status = 'ofertado';`;
    const [user_bids] = await database.query(query);
    console.log(user_bids);
    return user_bids;
  } catch (error) {
    console.log(error);
  }
}

async function getUserReceivedBidsBySellerId(userId) {
  try {
    const query = `SELECT bids.* FROM bids INNER JOIN products ON bids.product_id = products.id WHERE products.seller_id = '${userId}' AND sale_status = 'En venta';`;
    const [user_bids] = await database.query(query);
    return user_bids;
  } catch (error) {
    console.log(error);
  }
}

async function getUserCompletedBidsByBuyerId(userId) {
  try {
    const query = `SELECT * FROM bids INNER JOIN products ON bids.product_id = products.id WHERE sale_status = 'vendido' AND user_id = '${userId}';`;
    const [user_bids] = await database.query(query);
    return user_bids;
  } catch (error) {
    console.log(error);
  }
}

async function getProductsBidsById(productId) {
  try {
    const query = `SELECT * FROM bids WHERE product_id = '${productId}';`;
    const [product_bids] = await database.query(query);
    return product_bids;
  } catch (error) {
    console.log(error);
  }
}

async function acceptBid(bidId) {
  try {
    const query = `UPDATE bids SET bid_status = 'aceptado' WHERE id = ${bidId};`;
    const [product_bids] = await database.query(query);
    return product_bids;
  } catch (error) {
    console.log(error);
  }
}

async function declineBid(bidId) {
  try {
    const query = `UPDATE bids SET bid_status = 'rechazado' WHERE id = ?`;
    await database.query(query, bidId);
    const bid = await getBidById(bidId);
    console.log('here');

    return bid;
  } catch (error) {
    console.error(error);
  }
}

export {
  placeBid,
  checkBidData,
  deleteBid,
  getBidById,
  getBidsByProductId,
  modifyBid,
  getUserBidsById,
  getUserReceivedBidsBySellerId,
  getProductsBidsById,
  acceptBid,
  declineBid,
  getUserCompletedBidsByBuyerId,
};
