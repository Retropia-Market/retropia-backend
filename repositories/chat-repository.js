const { database } = require('../infrastructure');

const getContacts = async (userId) => {
    const query = 'SELECT id, username, image FROM users where id = ?';
    const [result] = await database.pool.query(query, userId);
    return result;
};

const getLastMessage = (userId) => {
    const query = 'SELECT ';
};

module.exports = { getContacts };
