import { database } from '../infrastructure';

const getContacts = async (userId) => {
  // const query =
  //   'SELECT contacts.*, U1.username AS username1, U2.username AS username2 FROM contacts JOIN users AS U1 ON U1.id = contacts.user_id_1 JOIN users AS U2 ON U2.id = contacts.user_id_2 WHERE user_id_1 = ? OR user_id_2 = ?';
  // const [result] = await database.pool.query(query, [userId, userId]);
  const query =
    'SELECT contacts.*, U1.username AS username1, U2.username AS username2, U2.image AS username2_image FROM contacts JOIN users AS U1 ON U1.id = contacts.user_id_1 JOIN users AS U2 ON U2.id = contacts.user_id_2 WHERE user_id_1 = ?';
  const [result] = await database.query(query, userId);
  return result;
};

const getLastMessages = async (userId) => {
  const query =
    'SELECT * FROM ( SELECT message.*, (ROW_NUMBER() OVER( PARTITION BY case when message.src_id > message.dst_id then concat(message.dst_id, message.src_id) else concat(message.src_id, message.dst_id) end ORDER BY id DESC)) as `rank` FROM message WHERE message.src_id = ? OR dst_id = ? ) message WHERE `rank` = 1';
  const [result] = await database.query(query, [userId, userId]);
  return result;
};

const getContact = async (userId) => {
  const query = 'SELECT id, username, image FROM users WHERE id = ?';
  const [result] = await database.query(query, userId);
  return result[0];
};

const addContact = async (userId, targetUserId) => {
  const query = 'INSERT INTO contacts(user_id_1, user_id_2) VALUES (?,?)';
  const [result] = await database.query(query, [userId, targetUserId]);
  return result;
};

const addMessage = async (message, userId, targetUserId) => {
  const query =
    'INSERT INTO message(src_id, dst_id, message, date) VALUES (?,?,?, curtime())';
  const [result] = await database.query(query, [userId, targetUserId, message]);
  return result;
};

const getMessages = async (userId, targetUserId) => {
  const query =
    'SELECT * FROM message where (src_id = ? AND dst_id = ?) OR (dst_id = ? AND src_id = ?) ORDER BY date ASC';
  const [result] = await database.query(query, [
    userId,
    targetUserId,
    userId,
    targetUserId,
  ]);
  return result;
};

export {
  getContacts,
  getContact,
  getLastMessages,
  addContact,
  addMessage,
  getMessages,
};