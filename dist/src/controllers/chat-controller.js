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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.addMessage = exports.addContact = exports.getContacts = void 0;
const joi_1 = __importDefault(require("joi"));
const repositories_1 = require("../repositories");
const getContacts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { userId } = req.params;
        if (Number(userId) !== id) {
            const err = new Error('No tienes los permisos para esta accion');
            err.code = 401;
            throw err;
        }
        const users = yield repositories_1.chatRepository.getContacts(id);
        const messages = yield repositories_1.chatRepository.getLastMessages(id);
        const contact = users.map((user) => {
            const m = messages.find((message) => (message.src_id === user.user_id_1 &&
                message.dst_id === user.user_id_2) ||
                (message.src_id === user.user_id_2 &&
                    message.dst_id === user.user_id_1));
            return Object.assign(Object.assign({}, user), { lastMessage: m });
        });
        contact.sort((a, b) => {
            const ad = (a && a.lastMessage && a.lastMessage.date) || 0;
            const bd = (b && b.lastMessage && b.lastMessage.date) || 0;
            if (ad != bd)
                return ad < bd ? 1 : -1;
            return a.username < b.username ? 1 : -1;
        });
        res.send(contact);
    }
    catch (error) {
        next(error);
    }
});
exports.getContacts = getContacts;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { srcId: source, dstId: target } = req.params;
        if (Number(source) !== id) {
            const err = new Error('No tienes los permisos para esta accion');
            err.code = 401;
            throw err;
        }
        if (source === target) {
            const err = new Error('Chat no encontrado');
            err.code = 404;
            throw err;
        }
        const targetUser = yield repositories_1.chatRepository.getContacts(target);
        if (!targetUser) {
            res.status(404).send({ error: 'El usuario no existe' });
        }
        const messages = yield repositories_1.chatRepository.getMessages(source, target);
        res.send({
            user: target,
            messages,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
const addContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { srcId: source, dstId: target } = req.params;
        if (Number(source) !== id) {
            const err = new Error('No tienes los permisos para esta accion');
            err.code = 401;
            throw err;
        }
        if (target === source) {
            const err = new Error('No puedes agregarte a ti mismo');
            err.code = 403;
            throw err;
        }
        const contacts = yield repositories_1.chatRepository.getContacts(source);
        for (const contact of contacts) {
            if (contact.user_id_2 === Number(target)) {
                const err = new Error('Este usuario ya se encuentra en la lista de contactos');
                err.code = 403;
                throw err;
            }
        }
        yield repositories_1.chatRepository.addContact(source, target);
        const updatedContacts = yield repositories_1.chatRepository.getContacts(source);
        res.send({
            status: 'OK',
            contacts: updatedContacts,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addContact = addContact;
const addMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.auth;
        const { srcId: source, dstId: target } = req.params;
        const { message } = req.body;
        if (Number(source) !== id) {
            const err = new Error('No tienes los permisos para esta accion');
            err.code = 401;
            throw err;
        }
        const targetUser = yield repositories_1.usersRepository.findUserById(target);
        if (!targetUser) {
            const err = new Error('Usuario no encontrado');
            err.code = 404;
            throw err;
        }
        if (target === source) {
            const err = new Error('No puedes enviarte un mensaje a ti mismo');
            err.code = 403;
            throw err;
        }
        const messageSchema = joi_1.default.string().required();
        yield messageSchema.validateAsync(message);
        const sourceContacts = yield repositories_1.chatRepository.getContacts(source);
        const targetContacts = yield repositories_1.chatRepository.getContacts(target);
        const sourceHasContact = sourceContacts.some((c) => c.user_id_2 === Number(target));
        const targetHasContact = targetContacts.some((c) => c.user_id_2 === Number(source));
        !sourceHasContact
            ? yield repositories_1.chatRepository.addContact(source, target)
            : sourceContacts;
        !targetHasContact
            ? yield repositories_1.chatRepository.addContact(target, source)
            : targetContacts;
        yield repositories_1.chatRepository.addMessage(message, Number(source), Number(target));
        const updatedMessages = yield repositories_1.chatRepository.getMessages(source, target);
        res.status(201);
        res.send({
            status: 'OK',
            messages: updatedMessages,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addMessage = addMessage;
//# sourceMappingURL=chat-controller.js.map