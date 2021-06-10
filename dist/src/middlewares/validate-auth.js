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
exports.validateAuthorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const infrastructure_1 = require("../infrastructure");
// TODO: REVISAR TIPOS
const validateAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            const error = new Error('Authorization header required');
            error.code = 401;
            throw error;
        }
        const token = authorization.slice(7, authorization.length);
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Comprobamos que el usuario para el que fue emitido
        // el token todavía existe.
        const query = 'SELECT * FROM users WHERE id = ?';
        const [user] = yield infrastructure_1.database.query(query, decodedToken.id);
        if (!user) {
            const error = new Error('El usuario ya no existe');
            error.code = 401;
            throw error;
        }
        req.auth = decodedToken;
        next();
    }
    catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
});
exports.validateAuthorization = validateAuthorization;
//# sourceMappingURL=validate-auth.js.map