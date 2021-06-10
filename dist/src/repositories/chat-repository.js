"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.addMessage = exports.addContact = exports.getLastMessages = exports.getContact = exports.getContacts = void 0;
const infrastructure_1 = require("../infrastructure");
const getContacts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const query =
    //   'SELECT contacts.*, U1.username AS username1, U2.username AS username2 FROM contacts JOIN users AS U1 ON U1.id = contacts.user_id_1 JOIN users AS U2 ON U2.id = contacts.user_id_2 WHERE user_id_1 = ? OR user_id_2 = ?';
    // const [result] = await database.pool.query(query, [userId, userId]);
    const query = 'SELECT contacts.*, U1.username AS username1, U2.username AS username2, U2.image AS username2_image FROM contacts JOIN users AS U1 ON U1.id = contacts.user_id_1 JOIN users AS U2 ON U2.id = contacts.user_id_2 WHERE user_id_1 = ?';
    const [result] = yield infrastructure_1.database.query(query, userId);
    return result;
});
exports.getContacts = getContacts;
const getLastMessages = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM ( SELECT message.*, (ROW_NUMBER() OVER( PARTITION BY case when message.src_id > message.dst_id then concat(message.dst_id, message.src_id) else concat(message.src_id, message.dst_id) end ORDER BY id DESC)) as `rank` FROM message WHERE message.src_id = ? OR dst_id = ? ) message WHERE `rank` = 1';
    const [result] = yield infrastructure_1.database.query(query, [userId, userId]);
    return result;
});
exports.getLastMessages = getLastMessages;
const getContact = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT id, username, image FROM users WHERE id = ?';
    const [result] = yield infrastructure_1.database.query(query, userId);
    return result[0];
});
exports.getContact = getContact;
const addContact = (userId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO contacts(user_id_1, user_id_2) VALUES (?,?)';
    const [result] = yield infrastructure_1.database.query(query, [userId, targetUserId]);
    return result;
});
exports.addContact = addContact;
const addMessage = (message, userId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO message(src_id, dst_id, message, date) VALUES (?,?,?, curtime())';
    const [result] = yield infrastructure_1.database.query(query, [userId, targetUserId, message]);
    return result;
});
exports.addMessage = addMessage;
const getMessages = (userId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM message where (src_id = ? AND dst_id = ?) OR (dst_id = ? AND src_id = ?) ORDER BY date ASC';
    const [result] = yield infrastructure_1.database.query(query, [
        userId,
        targetUserId,
        userId,
        targetUserId,
    ]);
    return result;
});
exports.getMessages = getMessages;
//# sourceMappingURL=chat-repository.js.map