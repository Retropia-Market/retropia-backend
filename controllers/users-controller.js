const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isCorrectUser } = require('../middlewares');
const { usersRepository } = require('../repositories');

async function getUsers(req, res, next) {
  try {
    const users = await usersRepository.getUsers();

    res.send(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await usersRepository.getUserById(id);

    res.send(user);
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

    const tokenPayload = { id: createdUser.id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201);
    res.send({
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        fristName: createdUser.firstName,
        lastName: createdUser.lastName,
        location: createdUser.location,
        bio: createdUser.bio,
        image: createdUser.image,
        phoneNumber: createdUser.phone_number,
        birthDate: createdUser.birth_date,
      },
      token,
    });
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

    const loggedUser = await usersRepository.findUserByEmail(email);

    // Comprobar que existe un usuario con ese email
    if (!loggedUser) {
      const err = new Error('No existe usuario con ese email');
      err.code = 401;
      throw err;
    }

    // Comprobar que la password del usuario es correcta
    const isValidPassword = await bcrypt.compare(password, loggedUser.password);
    if (!isValidPassword) {
      const error = new Error('El password no es válido');
      error.code = 401;
      throw error;
    }

    // Crear el token de autenticacion para el usuario
    const tokenPayload = { id: loggedUser.id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.send({
      userData: {
        id: loggedUser.id,
        username: loggedUser.username,
        email: loggedUser.email,
        fristName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        location: loggedUser.location,
        bio: loggedUser.bio,
        image: loggedUser.image,
        phoneNumber: loggedUser.phone_number,
        birthDate: loggedUser.birth_date,
      },
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
      username: Joi.string().max(30).allow(''),
      email: Joi.string().email().max(50).allow(''),
      firstName: Joi.string().max(50).allow(''),
      lastName: Joi.string().max(50).allow(''),
      location: Joi.string().max(100).allow(''),
      bio: Joi.string().max(500).allow(''),
      phone: Joi.string().max(9).allow(''),
      brithDate: Joi.date().allow(''),
    });

    await schema.validateAsync(data);

    const user = await usersRepository.updateProfile(data, id);

    res.status(201);
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      fristName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      bio: user.bio,
      image: user.image,
      phoneNumber: user.phone_number,
      birthDate: user.birth_date,
    });
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
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      fristName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      bio: user.bio,
      image: user.image,
      phoneNumber: user.phone_number,
      birthDate: user.birth_date,
    });
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
    res.send({
      image: user.image,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  userLogin,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
};
