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
exports.getReviewsNotifications = exports.getMessagesNotifications = exports.getBidsNotifications = void 0;
const infrastructure_1 = require("../infrastructure");
const getBidsNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT products.id , products.name, bids.watched as bids_notifications, users.id as user_id, users.username as bids_notifications from users JOIN products ON products.seller_id = users.id JOIN bids ON bids.product_id = products.id WHERE users.id = ? AND bids.watched = 0 AND bids.bid_status = 'ofertado';`;
    const [user_bids] = yield infrastructure_1.database.query(query, userId);
    return user_bids;
});
exports.getBidsNotifications = getBidsNotifications;
const getReviewsNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT products.id , products.name, reviews.watched as reviews_notifications, users.id as user_id, users.username from users JOIN products ON products.seller_id = users.id JOIN reviews ON reviews.product_id = products.id WHERE users.id = ? AND reviews.watched = 0;`;
    const [user_reviews] = yield infrastructure_1.database.query(query, userId);
    return user_reviews;
});
exports.getReviewsNotifications = getReviewsNotifications;
const getMessagesNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT users.id as user_id , users.username, message.status as message_notifications from users  JOIN message ON message.src_id = users.id WHERE message.dst_id = ? AND message.status = 0;`;
    const [user_messages] = yield infrastructure_1.database.query(query, userId);
    return user_messages;
});
exports.getMessagesNotifications = getMessagesNotifications;
//# sourceMappingURL=notifications-repository.js.map