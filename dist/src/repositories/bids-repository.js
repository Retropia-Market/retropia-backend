const { format } = require('date-fns');
const { database } = require('../infrastructure');
async function placeBid(userId, productId, bidPrice, message) {
    try {
        const eventDate = format(new Date(), 'yyyy/MM/dd');
        const query = `INSERT INTO bids (user_id, product_id, bid_price, bid_message, bid_date) VALUES ('${userId}','${productId}','${bidPrice}','${message}','${eventDate}');`;
        const [bids] = await database.pool.query(query);
        return bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function getBidsByProductId(productId) {
    try {
        const query = `SELECT * FROM bids WHERE product_id='${productId}';`;
        const [bids] = await database.pool.query(query);
        return bids[0];
    }
    catch (error) {
        console.log(error);
    }
}
async function getBidById(bidId) {
    try {
        const query = `SELECT * FROM bids WHERE id='${bidId}';`;
        const [bids] = await database.pool.query(query);
        return bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function checkBidData(userId, productId) {
    try {
        const query = `SELECT * FROM bids WHERE user_id = '${userId}' AND product_id='${productId}';`;
        const [bids] = await database.pool.query(query);
        return bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function deleteBid(bidId) {
    try {
        const query = `DELETE FROM bids WHERE id = '${bidId}';`;
        const [deleted_bid] = await database.pool.query(query);
        return deleted_bid;
    }
    catch (error) {
        console.log(error);
    }
}
async function modifyBid(bidId, data) {
    try {
        await Object.keys(data).forEach(async (bodyKey) => {
            if (bodyKey != 'subcategory') {
                const query = `UPDATE bids SET ${bodyKey} = '${data[bodyKey]}', edited_${bodyKey} = 1 WHERE id = ${bidId};`;
                await database.pool.query(query);
            }
        });
        return await getBidById(bidId);
    }
    catch (error) {
        console.log(error);
    }
}
async function getUserBidsById(userId) {
    try {
        const query = `SELECT * FROM bids WHERE user_id = '${userId}';`;
        const [user_bids] = await database.pool.query(query);
        console.log(user_bids);
        return user_bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function getUserReceivedBidsBySellerId(userId) {
    try {
        const query = `SELECT bids.* FROM bids INNER JOIN products ON bids.product_id = products.id WHERE products.seller_id = '${userId}';`;
        const [user_bids] = await database.pool.query(query);
        console.log(user_bids);
        return user_bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function getProductsBidsById(productId) {
    try {
        const query = `SELECT * FROM bids WHERE product_id = '${productId}';`;
        const [product_bids] = await database.pool.query(query);
        return product_bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function acceptBid(bidId) {
    try {
        const query = `UPDATE bids SET bid_status = 'aceptado' WHERE id = ${bidId};`;
        const [product_bids] = await database.pool.query(query);
        return product_bids;
    }
    catch (error) {
        console.log(error);
    }
}
async function declineBid(bidId) {
    try {
        const query = `UPDATE bids SET bid_status = 'rechazado' WHERE id = ?`;
        await database.pool.query(query, bidId);
        const bid = await getBidById(bidId);
        console.log('here');
        return bid;
    }
    catch (error) {
        console.error(error);
    }
}
module.exports = {
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
};
