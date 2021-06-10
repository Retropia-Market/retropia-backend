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
exports.declineBid = exports.acceptBid = exports.getProductsBidsById = exports.getUserReceivedBidsBySellerId = exports.getUserBidsById = exports.modifyBid = exports.getBidsByProductId = exports.getBidById = exports.deleteBid = exports.checkBidData = exports.placeBid = void 0;
const date_fns_1 = require("date-fns");
const infrastructure_1 = require("../infrastructure");
function placeBid(userId, productId, bidPrice, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const eventDate = date_fns_1.format(new Date(), 'yyyy/MM/dd');
            const query = `INSERT INTO bids (user_id, product_id, bid_price, bid_message, bid_date) VALUES ('${userId}','${productId}','${bidPrice}','${message}','${eventDate}');`;
            const [bids] = yield infrastructure_1.database.query(query);
            return bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.placeBid = placeBid;
function getBidsByProductId(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT * FROM bids WHERE product_id='${productId}';`;
            const [bids] = yield infrastructure_1.database.query(query);
            return bids[0];
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getBidsByProductId = getBidsByProductId;
function getBidById(bidId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT * FROM bids WHERE id='${bidId}';`;
            const [bids] = yield infrastructure_1.database.query(query);
            return bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getBidById = getBidById;
function checkBidData(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT * FROM bids WHERE user_id = '${userId}' AND product_id='${productId}';`;
            const [bids] = yield infrastructure_1.database.query(query);
            return bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.checkBidData = checkBidData;
function deleteBid(bidId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `DELETE FROM bids WHERE id = '${bidId}';`;
            const [deleted_bid] = yield infrastructure_1.database.query(query);
            return deleted_bid;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteBid = deleteBid;
function modifyBid(bidId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Object.keys(data).forEach((bodyKey) => __awaiter(this, void 0, void 0, function* () {
                if (bodyKey != 'subcategory') {
                    const query = `UPDATE bids SET ${bodyKey} = '${data[bodyKey]}', edited_${bodyKey} = 1 WHERE id = ${bidId};`;
                    yield infrastructure_1.database.query(query);
                }
            }));
            return yield getBidById(bidId);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.modifyBid = modifyBid;
function getUserBidsById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT * FROM bids WHERE user_id = '${userId}';`;
            const [user_bids] = yield infrastructure_1.database.query(query);
            console.log(user_bids);
            return user_bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getUserBidsById = getUserBidsById;
function getUserReceivedBidsBySellerId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT bids.* FROM bids INNER JOIN products ON bids.product_id = products.id WHERE products.seller_id = '${userId}';`;
            const [user_bids] = yield infrastructure_1.database.query(query);
            console.log(user_bids);
            return user_bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getUserReceivedBidsBySellerId = getUserReceivedBidsBySellerId;
function getProductsBidsById(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT * FROM bids WHERE product_id = '${productId}';`;
            const [product_bids] = yield infrastructure_1.database.query(query);
            return product_bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getProductsBidsById = getProductsBidsById;
function acceptBid(bidId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `UPDATE bids SET bid_status = 'aceptado' WHERE id = ${bidId};`;
            const [product_bids] = yield infrastructure_1.database.query(query);
            return product_bids;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.acceptBid = acceptBid;
function declineBid(bidId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `UPDATE bids SET bid_status = 'rechazado' WHERE id = ?`;
            yield infrastructure_1.database.query(query, bidId);
            const bid = yield getBidById(bidId);
            console.log('here');
            return bid;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.declineBid = declineBid;
//# sourceMappingURL=bids-repository.js.map