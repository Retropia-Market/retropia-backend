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
const repositories_1 = require("../repositories");
const getBidsNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: uid } = req.auth;
        const results = yield repositories_1.notificationsRepository.getBidsNotifications(uid);
        res.send(results);
    }
    catch (error) {
        next(error);
    }
});
exports.getBidsNotifications = getBidsNotifications;
const getReviewsNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: uid } = req.auth;
        const results = yield repositories_1.notificationsRepository.getReviewsNotifications(uid);
        res.send(results);
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewsNotifications = getReviewsNotifications;
const getMessagesNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: uid } = req.auth;
        const results = yield repositories_1.notificationsRepository.getMessagesNotifications(uid);
        res.send(results);
    }
    catch (error) {
        next(error);
    }
});
exports.getMessagesNotifications = getMessagesNotifications;
//# sourceMappingURL=notifications-controllers.js.map