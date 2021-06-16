import { database } from '../infrastructure';

async function getBidsNotifications(userId) {
    const query = `SELECT products.id , products.name, bids.watched as bids_notifications  as bids_notifications, users.id as user_id, users.usernamefrom users JOIN products ON products.seller_id = users.id JOIN bids ON bids.product_id = products.id WHERE users.id = ?;`;
    const [user_bids] = await database.query(query, userId);
    return user_bids;
}

async function getReviewsNotifications(userId) {
    const query = `SELECT products.id , products.name, reviews.watched as reviews_notifications, users.id as user_id, users.username from users JOIN products ON products.seller_id = users.id JOIN reviews ON reviews.product_id = products.id WHERE users.id = ?;`;
    const [user_reviews] = await database.query(query, userId);
    return user_reviews;
}

async function getMessagesNotifications(userId) {
    const query = `SELECT users.id as user_id , users.username, message.status as message_notifications from users  JOIN message ON message.dst_id = users.id WHERE users.id = ?;`;
    const [user_messages] = await database.query(query, userId);
    return user_messages;
}

export {
    getBidsNotifications,
    getMessagesNotifications,
    getReviewsNotifications,
};
