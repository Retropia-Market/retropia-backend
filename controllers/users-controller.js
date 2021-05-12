const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { usersRepository } = require('../repositories');

function isCorrectUser(reqParam, reqAuth) {
  /** Funcion para comprobar que un usuario accede solo a sus zonas de usuario.
   * Asume como reqParam el id en la ruta como req parameter,
   * y reqAuth como el id recibido mediante jwt
   */

  // Comprobar que el usuario con id del req param existe
  const user = usersRepository.findUserById(reqParam);
  if (!user) {
    const err = new Error('No existe usuario con ese email');
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

async function getUsers(req, res, next) {
  try {
    const users = await usersRepository.getUsers();

    res.send(users);
  } catch (error) {
    next(error);
  }
}

async function registerUser(req, res, next) {
  try {
    const data = req.body;

    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(8).max(20).alphanum().required(),
      repeatedPassword: Joi.string().min(8).max(20).alphanum().required(),
      email: Joi.string().email().required(),
      birthDate: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    });

    await schema.validateAsync(data);

    // Comprobar si las passwords coinciden
    if (data.password !== data.repeatedPassword) {
      const err = new Error('Las contraseñas deben ser iguales');
      err.code = 400;
      throw err;
    }

    // Comprobar si ya existe un usuario con ese email
    const user = await usersRepository.findUserByEmail(data.email);
    if (user) {
      const err = new Error('Parece que ya existe un usuario con ese correo.');
      err.code = 409;
      throw err;
    }

    // hasheo de la password
    data.password = await bcrypt.hash(data.password, 10);

    const createdUser = await usersRepository.registerUser(data);

    res.status(201);
    res.send(createdUser);
  } catch (error) {
    next(error);
  }
}

async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(20).alphanum().required(),
    });

    await schema.validateAsync({ email, password });

    const user = await usersRepository.findUserByEmail(email);

    // Comprobar que existe un usuario con ese email
    if (!user) {
      const err = new Error('No existe usuario con ese email');
      err.code = 401;
      throw err;
    }

    // Comprobar que la password del usuario es correcta
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error('El password no es válido');
      error.code = 401;
      throw error;
    }

    // Crear el token de autenticacion para el usuario
    const tokenPayload = { id: user.id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.send({
      id: user.id,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Comprobar que el id es correcto
    isCorrectUser(id, req.auth.id);

    const schema = Joi.object({
      username: Joi.string().max(30),
      email: Joi.string().email().max(50),
      firstname: Joi.string().max(50),
      lastname: Joi.string().max(50),
      location: Joi.string().max(100),
      bio: Joi.string().max(500),
      phone_number: Joi.string().max(9),
      brith_date: Joi.date(),
    });

    await schema.validateAsync(data);

    const user = await usersRepository.updateProfile(data, id);

    res.status(201);
    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Comprobar que el id es correcto
    isCorrectUser(id, req.auth.id);

    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).max(20).alphanum().required(),
      repeatedNewPassword: Joi.string().min(8).max(20).alphanum().required(),
    });
    await schema.validateAsync(data);

    // Comprobar que la password antigua es la correcta
    let user = await usersRepository.findUserById(id);
    const isValidPassword = await bcrypt.compare(
      data.oldPassword,
      user.password
    );
    if (!isValidPassword) {
      const err = new Error('La contrasenia actual es incorrecta');
      err.code = 401;
      throw err;
    }

    // Comprobar que las nuevas password nuevas coinciden
    if (data.newPassword !== data.repeatedNewPassword) {
      const err = new Error('Las constrasenias no coinciden');
      err.code = 400;
      throw err;
    }

    // Actualizar la password en la database
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user = await usersRepository.updatePassword(hashedPassword, id);

    res.status(201);
    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function updateImage(req, res, next) {
  try {
    const { id } = req.params;
    isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto

    const user = await usersRepository.updateImage(req.auth.id, req.file.path);

    res.status(201);
    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function deleteImage(req, res, next) {
  try {
    const { id } = req.params;
    isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto

    const user = await usersRepository.deleteImage(id);

    res.status(201); // correct status: 204
    res.send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  isCorrectUser,
  getUsers,
  registerUser,
  userLogin,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
};
