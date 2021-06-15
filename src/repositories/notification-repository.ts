import { database } from '../infrastructure';

async function getNotificationsBids(userId) {
    const query = `SELECT * FROM bids INNER JOIN products ON products.id = bids.product_id INNER JOIN user.id = products.seller_id WHERE user.id = ?;`;
    const [user_bids] = await database.query(query, userId);
    return user_bids;
}
export { getNotificationsBids };
