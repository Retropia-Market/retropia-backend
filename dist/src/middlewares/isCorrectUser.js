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
exports.isCorrectUser = void 0;
// TODO: REVISAR TIPOS
const users_repository_1 = require("../repositories/users-repository");
/**
 * Funcion para devolver error en caso de que el token de autenticacion no
 * corresponda con la peticion
 * @param {string} reqParam id del usuario en la ruta como req.param
 * @param {string} reqAuth id del usuario extraido del JWT
 */
const isCorrectUser = (reqParam, reqAuth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Comprobar que el usuario con id del req param existe
        const user = yield users_repository_1.findUserById(reqParam);
        if (!user) {
            const err = new Error('No existe el usuario');
            err.code = 401;
            throw err;
        }
        // Comprobar que el id del parametro y el del usuario que intenta acceder son el mismo
        if (Number(reqParam) !== reqAuth) {
            const err = new Error('No tienes los permisos para acceder a este lugar');
            err.code = 403;
            throw err;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.isCorrectUser = isCorrectUser;
//# sourceMappingURL=isCorrectUser.js.map