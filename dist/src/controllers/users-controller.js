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
exports.deleteImage = exports.updateImage = exports.updatePassword = exports.updateProfile = exports.userLogin = exports.registerUser = exports.getUserById = exports.getUsers = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { isCorrectUser } = require('../middlewares');
const { usersRepository } = require('../repositories');
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersRepository.getUsers();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield usersRepository.getUserById(id);
        res.send(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const schema = joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().min(8).max(20).alphanum().required(),
            repeatedPassword: joi_1.default.string().min(8).max(20).alphanum().required(),
            email: joi_1.default.string().email().required(),
            birthDate: joi_1.default.string().required(),
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
        });
        yield schema.validateAsync(data);
        // Comprobar si las passwords coinciden
        if (data.password !== data.repeatedPassword) {
            const err = new Error('Las contraseñas deben ser iguales');
            err.code = 400;
            throw err;
        }
        // Comprobar si ya existe un usuario con ese email
        const user = yield usersRepository.findUserByEmail(data.email);
        if (user) {
            const err = new Error('Parece que ya existe un usuario con ese correo.');
            err.code = 409;
            throw err;
        }
        // hasheo de la password
        data.password = yield bcryptjs_1.default.hash(data.password, 10);
        const createdUser = yield usersRepository.registerUser(data);
        const tokenPayload = { id: createdUser.id };
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.status(201);
        res.send({
            userData: {
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                firstName: createdUser.firstname,
                lastName: createdUser.lastname,
                location: createdUser.location,
                bio: createdUser.bio,
                image: createdUser.image,
                phoneNumber: createdUser.phone_number,
                birthDate: createdUser.birth_date,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        });
        yield schema.validateAsync({ email, password });
        const loggedUser = yield usersRepository.findUserByEmail(email);
        // Comprobar que existe un usuario con ese email
        if (!loggedUser) {
            const err = new Error('No existe usuario con ese email');
            err.code = 401;
            throw err;
        }
        // Comprobar que la password del usuario es correcta
        const isValidPassword = yield bcryptjs_1.default.compare(password, loggedUser.password);
        if (!isValidPassword) {
            const err = new Error('El password no es válido');
            err.code = 401;
            throw err;
        }
        // Crear el token de autenticacion para el usuario
        const tokenPayload = { id: loggedUser.id };
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.send({
            userData: {
                id: loggedUser.id,
                username: loggedUser.username,
                email: loggedUser.email,
                firstName: loggedUser.firstname,
                lastName: loggedUser.lastname,
                location: loggedUser.location,
                bio: loggedUser.bio,
                image: loggedUser.image,
                phoneNumber: loggedUser.phone_number,
                birthDate: loggedUser.birth_date,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
// TODO: REVISAR TIPOS
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        // TODO comprobar que tanto email como idparam existen
        // Comprobar que el id es correcto
        //TODO no comprueba bien la igualdad de IDs
        isCorrectUser(id, req.auth.id);
        const schema = joi_1.default.object({
            username: joi_1.default.string().max(30).allow(''),
            email: joi_1.default.string().email().max(50).allow(''),
            firstname: joi_1.default.string().max(50).allow(''),
            lastname: joi_1.default.string().max(50).allow(''),
            location: joi_1.default.string().max(100).allow(''),
            bio: joi_1.default.string().max(500).allow(''),
            phone_number: joi_1.default.string().max(9).allow(''),
            birth_date: joi_1.default.string().allow(''),
        });
        yield schema.validateAsync(data);
        const user = yield usersRepository.updateProfile(data, id);
        res.status(201);
        res.send({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            location: user.location,
            bio: user.bio,
            image: user.image,
            phoneNumber: user.phone_number,
            birthDate: user.birth_date,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
// TODO: REVISAR TIPOS
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        // Comprobar que el id es correcto
        isCorrectUser(id, req.auth.id);
        // Comprobar que la password antigua es la correcta
        let user = yield usersRepository.findUserById(id);
        const isValidPassword = yield bcryptjs_1.default.compare(data.oldPassword, user.password);
        if (!isValidPassword) {
            const err = new Error('La contrasenia actual es incorrecta');
            err.code = 401;
            err.message = 'La contrasenia actual es incorrecta';
            throw err;
        }
        // validar nueva password
        const schema = joi_1.default.object({
            oldPassword: joi_1.default.string().required(),
            newPassword: joi_1.default.string().min(8).max(20).alphanum().required(),
            repeatedNewPassword: joi_1.default.string().min(8).max(20).alphanum().required(),
        });
        yield schema.validateAsync(data);
        // Comprobar que las nuevas password nuevas coinciden
        if (data.newPassword !== data.repeatedNewPassword) {
            const err = new Error('Las constrasenias no coinciden');
            err.code = 400;
            throw err;
        }
        // Actualizar la password en la database
        const hashedPassword = yield bcryptjs_1.default.hash(data.newPassword, 10);
        user = yield usersRepository.updatePassword(hashedPassword, id);
        res.status(201);
        res.send({
            user: user.username,
            res: 'Password changed',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePassword = updatePassword;
// TODO: REVISAR TIPOS
const updateImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto
        const user = yield usersRepository.updateImage(req.auth.id, req.file.path);
        res.status(201);
        res.send({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            location: user.location,
            bio: user.bio,
            image: user.image,
            phoneNumber: user.phone_number,
            birthDate: user.birth_date,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateImage = updateImage;
// TODO: REVISAR TIPOS
const deleteImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto
        const user = yield usersRepository.deleteImage(id);
        res.status(201); // correct status: 204
        res.send({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            location: user.location,
            bio: user.bio,
            image: user.image,
            phoneNumber: user.phone_number,
            birthDate: user.birth_date,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteImage = deleteImage;
//# sourceMappingURL=users-controller.js.map