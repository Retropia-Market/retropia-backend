import { RequestHandler } from 'express';
import Joi from 'joi';

import * as ws from '../ws';
import { ErrnoException } from 'src/models/Error';
import { chatRepository, usersRepository } from '../repositories';

const getContactList: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { userId } = req.params;

    if (Number(userId) !== id) {
      const err: ErrnoException = new Error(
        'No tienes los permisos para esta accion'
      );
      err.code = 401;
      throw err;
    }

    const users: any = await chatRepository.getContacts(id);
    const messages: any = await chatRepository.getLastMessages(id);
    const contact = users.map((user) => {
      const m = messages.find(
        (message) =>
          (message.src_id === user.user_id_1 &&
            message.dst_id === user.user_id_2) ||
          (message.src_id === user.user_id_2 &&
            message.dst_id === user.user_id_1)
      );
      return { ...user, lastMessage: m };
    });
    contact.sort((a, b) => {
      const ad = (a && a.lastMessage && a.lastMessage.date) || 0;
      const bd = (b && b.lastMessage && b.lastMessage.date) || 0;
      if (ad != bd) return ad < bd ? 1 : -1;
      return a.username < b.username ? 1 : -1;
    });
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

const getMessages: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { srcId: source, dstId: target } = req.params;

    if (Number(source) !== id) {
      const err: ErrnoException = new Error(
        'No tienes los permisos para esta accion'
      );
      err.code = 401;
      throw err;
    }

    if (source === target) {
      const err: ErrnoException = new Error('Chat no encontrado');
      err.code = 404;
      throw err;
    }

    const targetUser = await chatRepository.getContacts(target);
    if (!targetUser) {
      res.status(404).send({ error: 'El usuario no existe' });
    }

    const messages = await chatRepository.getMessages(source, target);
    res.send({
      user: target,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

const addContact: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { srcId: source, dstId: target } = req.params;

    if (Number(source) !== id) {
      const err: ErrnoException = new Error(
        'No tienes los permisos para esta accion'
      );
      err.code = 401;
      throw err;
    }

    if (target === source) {
      const err: ErrnoException = new Error('No puedes agregarte a ti mismo');
      err.code = 403;
      throw err;
    }
    const contacts: any = await chatRepository.getContacts(source);

    for (const contact of contacts) {
      if (contact.user_id_2 === Number(target)) {
        const err: ErrnoException = new Error(
          'Este usuario ya se encuentra en la lista de contactos'
        );
        err.code = 403;
        throw err;
      }
    }

    const result = await chatRepository.addContact(source, target);
    console.log(result);

    const contact = await usersRepository.findUserById(target);

    res.send({
      status: 'OK',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

const addMessage: RequestHandler = async (req: any, res, next) => {
  try {
    const { id } = req.auth;
    const { srcId: source, dstId: target } = req.params;
    const { message: reqMessage } = req.body;

    if (Number(source) !== id) {
      const err: ErrnoException = new Error(
        'No tienes los permisos para esta accion'
      );
      err.code = 401;
      throw err;
    }

    const targetUser = await usersRepository.findUserById(target);
    if (!targetUser) {
      const err: ErrnoException = new Error('Usuario no encontrado');
      err.code = 404;
      throw err;
    }

    if (target === source) {
      const err: ErrnoException = new Error(
        'No puedes enviarte un mensaje a ti mismo'
      );
      err.code = 403;
      throw err;
    }

    const messageSchema = Joi.string().required();
    await messageSchema.validateAsync(reqMessage);

    const sourceContacts: any = await chatRepository.getContacts(source);
    const targetContacts: any = await chatRepository.getContacts(target);

    const sourceHasContact = sourceContacts.some(
      (c) => c.user_id_2 === Number(target)
    );
    const targetHasContact = targetContacts.some(
      (c) => c.user_id_2 === Number(source)
    );

    !sourceHasContact
      ? await chatRepository.addContact(source, target)
      : sourceContacts;
    !targetHasContact
      ? await chatRepository.addContact(target, source)
      : targetContacts;

    const message: any = await chatRepository.addMessage1(
      reqMessage,
      Number(source),
      Number(target)
    );

    const updatedMessages = await chatRepository.getMessages(source, target);
    ws.send(message);
    res.status(201);
    res.send({
      status: 'OK',
      messages: updatedMessages,
    });
  } catch (error) {
    next(error);
  }
};

export { getContactList, addContact, addMessage, getMessages };
