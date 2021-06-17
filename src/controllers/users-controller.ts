import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

import { isCorrectUser } from '../middlewares';
import { usersRepository } from '../repositories';

import { RequestHandler } from 'express';
import { ErrnoException } from '../models/Error';
import { CustomReq } from './mail-controller';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await usersRepository.getUsers();

    res.send(users);
  } catch (error) {
    next(error);
  }
};

const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersRepository.getUserById(id);

    res.send(user);
  } catch (error) {
    next(error);
  }
};

const registerUser: RequestHandler = async (req: any, res, next) => {
  try {
    const data = req.body;

    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(8).max(20).alphanum().required(),
      repeatedPassword: Joi.string().min(8).max(20).alphanum().required(),
      email: Joi.string().email().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    });

    await schema.validateAsync(data);

    // Comprobar si las passwords coinciden
    if (data.password !== data.repeatedPassword) {
      const err: ErrnoException = new Error(
        'Las contraseñas deben ser iguales'
      );
      err.code = 400;
      throw err;
    }

    // Comprobar si ya existe un usuario con ese email
    const user = await usersRepository.getUserByEmail(data.email);
    if (user) {
      const err: ErrnoException = new Error(
        'Parece que ya existe un usuario con ese correo.'
      );
      err.code = 409;
      throw err;
    }

    // hasheo de la password
    data.password = await bcrypt.hash(data.password, 10);
    data.email_code = crypto.randomBytes(64).toString('hex');

    const createdUser = await usersRepository.registerUser(data);

    req.user = createdUser;
    next();
  } catch (error) {
    next(error);
  }
};

const emailVerification: RequestHandler = async (req, res, next) => {
  try {
    const { email_code } = req.params;

    let verifiedUser = await usersRepository.emailVerification(email_code);

    if (!verifiedUser) {
      const err: ErrnoException = new Error('No user found');
      err.code = 404;
      throw err;
    }

    if (verifiedUser.verified) {
      const err: ErrnoException = new Error('Este usuario ya esta verificado');
      err.code = 403;
      throw err;
    }

    verifiedUser = await usersRepository.validateUser(verifiedUser.id);

    const tokenPayload = { id: verifiedUser.id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.send({
      userData: {
        id: verifiedUser.id,
        username: verifiedUser.username,
        email: verifiedUser.email,
        firstName: verifiedUser.firstname,
        lastName: verifiedUser.lastname,
        location: verifiedUser.location,
        bio: verifiedUser.bio,
        image: verifiedUser.image,
        phoneNumber: verifiedUser.phone_number,
        birthDate: verifiedUser.birth_date,
        verified: verifiedUser.verified,
        externalUser: verifiedUser.external_user,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const passwordRecoveryRequest: RequestHandler = async (
  req: CustomReq,
  res,
  next
) => {
  try {
    const { email } = req.body;
    const user = await usersRepository.getUserByEmail(email);

    if (!user) {
      const err: ErrnoException = new Error(
        'No se ha encontrado usuario con ese correo'
      );
      err.code = 404;
      throw err;
    }

    req.user = user;
  } catch (error) {
    next(error);
  }
};

const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    await schema.validateAsync({ email, password });

    const loggedUser = await usersRepository.getUserByEmail(email);

    // Comprobar que existe un usuario con ese email
    if (!loggedUser) {
      const err: ErrnoException = new Error('No existe usuario con ese email');
      err.code = 401;
      throw err;
    }

    // Comprobar que la password del usuario es correcta
    const isValidPassword = await bcrypt.compare(password, loggedUser.password);
    if (!isValidPassword) {
      const err: ErrnoException = new Error('El password no es válido');
      err.code = 401;
      throw err;
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
        firstName: loggedUser.firstname,
        lastName: loggedUser.lastname,
        location: loggedUser.location,
        bio: loggedUser.bio,
        image: loggedUser.image,
        phoneNumber: loggedUser.phone_number,
        birthDate: loggedUser.birth_date,
        verified: loggedUser.verified,
        externalUser: loggedUser.external_user,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const userGoogleLogin: RequestHandler = async (req, res, next) => {
  try {
    let loggedUser;
    const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_LOGIN_ID);
    let { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_LOGIN_ID,
    });
    const { email, name, given_name, family_name, picture, at_hash } =
      ticket.getPayload();

    const user = await usersRepository.getUserByEmail(email);
    if (user) {
      if (!user.vierified) {
        await usersRepository.validateUser(user.id);
      }
      loggedUser = await usersRepository.getUserById(user.id);
    } else {
      const userData = {
        //TODO: hacer username unico uuid
        username: name.replace(/\s+/g, ''),
        firstName: given_name,
        lastName: family_name,
        email: email,
        password: at_hash,
      };
      userData.password = await bcrypt.hash(userData.password, 10);
      let newUser = await usersRepository.registerUser(userData);
      newUser = await usersRepository.makeExternalUser(newUser.id);
      newUser = await usersRepository.validateUser(newUser.id);
      // newUser = await usersRepository.validateUser(newUser.id)
      loggedUser = await usersRepository.updateImage(newUser.id, picture);
    }

    const tokenPayload = { id: loggedUser.id };
    token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
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
        verified: loggedUser.verified,
        externalUser: loggedUser.external_user,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const updateProfile: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // TODO comprobar que tanto email como idparam existen

    // Comprobar que el id es correcto
    //TODO no comprueba bien la igualdad de IDs
    isCorrectUser(id, req.auth.id);

    const schema = Joi.object({
      username: Joi.string().max(30).allow(''),
      email: Joi.string().email().max(50).allow(''),
      firstname: Joi.string().max(50).allow(''),
      lastname: Joi.string().max(50).allow(''),
      location: Joi.string().max(100).allow(''),
      bio: Joi.string().max(500).allow(''),
      phone_number: Joi.string().max(9).allow(''),
      birth_date: Joi.string().allow(''),
    });

    await schema.validateAsync(data);

    const user = await usersRepository.updateProfile(data, id);

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
      verified: user.verified,
      externalUser: user.external_user,
    });
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const updatePassword: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Comprobar que el id es correcto
    isCorrectUser(id, req.auth.id);

    // Comprobar que la password antigua es la correcta
    let user = await usersRepository.findUserById(id);
    const isValidPassword = await bcrypt.compare(
      data.oldPassword,
      user.password
    );
    if (!isValidPassword) {
      const err: ErrnoException = new Error(
        'La contrasenia actual es incorrecta'
      );
      err.code = 401;
      err.message = 'La contrasenia actual es incorrecta';
      throw err;
    }

    // validar nueva password
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).max(20).alphanum().required(),
      repeatedNewPassword: Joi.string().min(8).max(20).alphanum().required(),
    });
    await schema.validateAsync(data);

    // Comprobar que las nuevas password nuevas coinciden
    if (data.newPassword !== data.repeatedNewPassword) {
      const err: ErrnoException = new Error('Las constrasenias no coinciden');
      err.code = 400;
      throw err;
    }

    // Actualizar la password en la database
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user = await usersRepository.updatePassword(hashedPassword, id);

    res.status(201);
    res.send({
      user: user.username,
      res: 'Password changed',
    });
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const updateImage: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto

    const user = await usersRepository.updateImage(req.auth.id, req.file.path);

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
      verified: user.verified,
      externalUser: user.external_user,
    });
  } catch (error) {
    next(error);
  }
};

// TODO: REVISAR TIPOS
const deleteImage: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.params;
    isCorrectUser(id, req.auth.id); // Comprobar que el id es correcto

    const user = await usersRepository.deleteImage(id);

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
      verified: user.verified,
      externalUser: user.external_user,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getUsers,
  getUserById,
  registerUser,
  emailVerification,
  passwordRecoveryRequest,
  userLogin,
  userGoogleLogin,
  updateProfile,
  updatePassword,
  updateImage,
  deleteImage,
};
