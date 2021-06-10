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
exports.deleteImage = exports.updateImage = exports.updatePassword = exports.updateProfile = exports.registerUser = exports.findUserById = exports.findUserByEmail = exports.getUserById = exports.getUsers = void 0;
const fs = require('fs').promises;
const infrastructure_1 = require("../infrastructure");
/**############################################################################
 *
 * Funcion para obtener todos los usuarios registrados en la pagina
 * @returns {array} users registrados
 */
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM users';
    const [users] = yield infrastructure_1.database.query(query);
    return users;
});
exports.getUsers = getUsers;
/**#############################################################################
 *
 * Funcion para obtener la informacion del usuario
 * @param {string} id
 * @returns {object} informacion del usuario
 */
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [user] = yield infrastructure_1.database.query(query, id);
        return user[0];
    });
}
exports.getUserById = getUserById;
/**############################################################################
 *
 * Funcion para buscar usuario por direccion de correo electronico
 * @param {string} email email del usuario a buscar
 * @returns {object} usuario con email proporcionado
 */
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [users] = yield infrastructure_1.database.query(query, email);
        return users[0];
    });
}
exports.findUserByEmail = findUserByEmail;
/**############################################################################
 *
 * Funcion para obtener usuario por id de usuario
 * @param {string} id id del usuario a buscar
 * @returns {object} usuario con id proporcionado
 */
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [users] = yield infrastructure_1.database.query(query, id);
        return users[0];
    });
}
exports.findUserById = findUserById;
/**############################################################################
 *
 * Funcion para registrar usuario
 * @param {object} data objeto con la informacion obligatoria de registro
 * @returns {object} objeto con la informacion del usuario creado
 */
function registerUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO users (username, password, email, birth_date, firstname, lastname) VALUES (?,?,?,?,?,?)';
        yield infrastructure_1.database.query(query, [
            data.username,
            data.password,
            data.email,
            data.birthDate,
            data.firstName,
            data.lastName,
        ]);
        return findUserByEmail(data.email);
    });
}
exports.registerUser = registerUser;
/**############################################################################
 *
 * Funcion para actualizar el perfil de un usuario
 * @param {object} data objecto con la nueva informacion del usuario
 * @param {string} id id del usuario
 * @returns {object} objeto del usuario actualizado
 */
function updateProfile(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const replaceNotNull = (column, value, userId = id) => __awaiter(this, void 0, void 0, function* () {
            /** se asume que column es la propiedad cuyo valor se quiere cambiar en la base de datos,
             * value el nuevo valor que se le quiere dar,
             * y userId el id de usuario a cambiar la informacion.
             */
            if (value !== undefined && value.length) {
                const updateProfileQuery = `UPDATE users SET ${column} = '${value}' WHERE id = '${userId}'`;
                yield infrastructure_1.database.query(updateProfileQuery);
            }
        });
        for (const property in data)
            yield replaceNotNull(property, data[property]);
        return findUserById(id);
    });
}
exports.updateProfile = updateProfile;
/**############################################################################
 *
 * Funcion para actualizar la password de un usuario
 * @param {string} hashedPassword hash de la nueva password proporcionada
 * @param {string} id id del usuario
 * @returns {object} del objeto actualizado
 */
function updatePassword(hashedPassword, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
        yield infrastructure_1.database.query(updatePasswordQuery, [hashedPassword, id]);
        return findUserById(id);
    });
}
exports.updatePassword = updatePassword;
/**############################################################################
 *
 * Funcion para actualizar la imagen de un usuario
 * @param {string} id id del usuario
 * @param {string} imagePath
 * @returns {object} objeto del usuario actualizado
 */
function updateImage(id, imagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // obtener path a la imagen anterior del usuario
        const searchQuery = 'SELECT image FROM users WHERE id = ?';
        const [[{ image }]] = yield infrastructure_1.database.query(searchQuery, id);
        // borrar imagen anterior si existe
        image !== null ? yield fs.unlink(image) : image;
        // acualizar la path a la imagen en la info del usuario
        const updateQuery = 'UPDATE users SET image = ? WHERE id = ?';
        yield infrastructure_1.database.query(updateQuery, [imagePath, id]);
        return findUserById(id);
    });
}
exports.updateImage = updateImage;
/**############################################################################
 *
 * Funcion para eliminar la imagen de un usuario
 * @param {string} id id del usuario
 * @returns {object} objecto con el usuario actualizado
 */
function deleteImage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Obtener path a la imagen del usuario
        const searchQuery = 'SELECT image FROM users WHERE id = ?';
        const [[{ image }]] = yield infrastructure_1.database.query(searchQuery, id);
        // borrar la imagen si existe
        image !== null ? yield fs.unlink(image) : image;
        // eliminar path vacia de la informacion del usuario
        const updateQuery = 'UPDATE users SET image = null WHERE id = ?';
        yield infrastructure_1.database.query(updateQuery, id);
        return findUserById(id);
    });
}
exports.deleteImage = deleteImage;
//# sourceMappingURL=users-repository.js.map