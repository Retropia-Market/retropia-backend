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
exports.send = exports.init = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ws_1 = __importDefault(require("ws"));
const repositories_1 = require("./repositories");
const users_repository_1 = require("./repositories/users-repository");
const secret = process.env.JWT_SECRET;
// State
let wss;
const clients = new Map();
// Actions
const send = (message) => {
    const dst_id = clients.get(message.dst_id) || [];
    const src_id = clients.get(message.src_id) || [];
    const sockets = [...src_id, ...dst_id];
    const text = JSON.stringify(message);
    sockets.forEach((c) => c.send(text));
};
exports.send = send;
const init = (server) => {
    wss = new ws_1.default.Server({ server, path: '/ws' });
    wss.on('connection', (socket) => {
        console.log('new client connected');
        socket.on('message', (e) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('new message');
            const data = JSON.parse(e);
            console.log(data);
            if (!socket.auth) {
                try {
                    const uid = parseInt(jsonwebtoken_1.default.verify(data === null || data === void 0 ? void 0 : data.auth, secret));
                    socket.auth = { uid };
                    if (!clients.get(uid))
                        clients.set(uid, []);
                    clients.get(uid).push(socket);
                }
                catch (e) {
                    socket.send(JSON.stringify({ error: 'Auth required' }));
                }
            }
            else {
                if (!data.message || !data.target) {
                    socket.send(JSON.stringify({
                        error: 'Falta algún campo obligatorio: message, target',
                    }));
                }
                else {
                    const targetUser = yield users_repository_1.findUserById(data.target);
                    if (!targetUser || data.target === socket.auth.uid) {
                        socket.send(JSON.stringify({
                            error: 'Chat no encontrado',
                        }));
                        return;
                    }
                    const message = yield repositories_1.chatRepository.addMessage(data.message, socket.auth.uid, data.target);
                    console.log(message);
                    send(message);
                }
            }
        }));
        socket.on('close', () => {
            var _a;
            console.log('client disconnected');
            const uid = (_a = socket.auth) === null || _a === void 0 ? void 0 : _a.uid;
            if (uid) {
                clients.set(uid, clients.get(uid).filter((s) => s !== socket));
            }
        });
    });
};
exports.init = init;
//# sourceMappingURL=ws.js.map