const { startOfHour } = require('date-fns/esm');
const { isSchema } = require('joi');
const Joi = require('joi');

const { chatRepository } = require('../repositories');

const getContacts = async (req, res, next) => {
  try {
    const { id } = req.auth;
    const users = await chatRepository.getContacts(id);
    const messages = await chatRepository.getLastMessages(id);
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

const getMessages = async (req, res, next) => {
  try {
    const { id } = req.auth;
    const { srcId: source, dstId: target } = req.params;

    if (Number(source) !== id) {
      const err = new Error('No tienes los permisos para esta accion');
      err.code = 401;
      throw err;
    }

    if (target === id) {
      const err = new Error('Chat no encontrado');
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

const addContact = async (req, res, next) => {
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
    const contacts = await chatRepository.getContacts(source);

    for (const contact of contacts) {
      if (contact.user_id_2 === Number(target)) {
        const err = new Error(
          'Este usuario ya se encuentra en la lista de contactos'
        );
        err.code = 403;
        throw err;
      }
    }

    await chatRepository.addContact(source, target);

    const updatedContacts = await chatRepository.getContacts(source);

    res.send({
      status: 'OK',
      contacts: updatedContacts,
    });
  } catch (error) {
    next(error);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { id } = req.auth;
    const { srcId: source, dstId: target } = req.params;
    const { message } = req.body;

    if (Number(source) !== id) {
      const err = new Error('No tienes los permisos para esta accion');
      err.code = 401;
      throw err;
    }

    if (target === source) {
      const err = new Error('No puedes enviarte un mensaje a ti mismo');
      err.code = 403;
      throw err;
    }

    const messageSchema = Joi.object({
      message: Joi.string().required(),
    });
    await messageSchema.validateAsync(message);

    const sourceContacts = await chatRepository.getContacts(source);
    const targetContacts = await chatRepository.getContacts(source);

    const sourceHasContact = sourceContacts.some((c) => c.user_id_2 === target);
    const targetHasContact = targetContacts.some((c) => c.user_id_2 === source);

    !sourceHasContact
      ? await chatRepository.addContact(source, target)
      : sourceContacts;
    !targetHasContact
      ? await chatRepository.addContact(target, source)
      : targetContacts;

    await chatRepository.addMessage(message, source, target);
    const updatedMessages = await chatRepository.getMessages(source, target);

    res.status(201);
    res.send({
      status: 'OK',
      messages: updatedMessages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  addContact,
  addMessage,
  getMessages,
};
