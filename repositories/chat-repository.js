const { database } = require('../infrastructure');

const getContacts = async (userId) => {
    const query =
        'SELECT products.id AS product_id, products.seller_id, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views, reviews.id AS review_id, reviews.review_rating, reviews.review_text, reviews.review_date, reviews.user_id AS reviewer_id, users.username as reviewer_name FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN reviews ON reviews.product_id = products.id INNER JOIN users ON users.id = reviews.user_id WHERE products.seller_id = ?';
    const [result] = await database.pool.query(query, userId);
    return result;
};

const getLastMessages = (userId) => {
    const query =
        'SELECT * from message WHERE src_id = ? OR dst_id = ? ORDER BY id DESC';
    const [result] = await database.pool.query(query, userId);
    return result;
};

const getContact = async (userId) => {
    const query = 'SELECT id, username, image FROM users WHERE id = ?';
    const [result] = await database.pool.query(query, userId);
    return result[0];
};

const addContact = async (userIdLogged, userIdVisited) => {
    const query = 'INSERT INTO contacts(user_id_1, user_id_2) VALUES (?,?)';
    const [result] = await database.pool.query(query, [
        userIdLogged,
        userIdVisited,
    ]);
    return result;
};

const addMessage = async (message, userIdLogged, userIdVisited) => {
    const query =
        'INSERT INTO message(message, src_id, dst_id, date) VALUES (?,?, ?, curdate())';
    const [result] = await database.pool.query(query, [
        message,
        userIdLogged,
        userIdVisited,
    ]);
    return result;
};

module.exports = {
    getContacts,
    getContact,
    getLastMessages,
    addContact,
    addMessage,
};
