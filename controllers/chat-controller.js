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
    const { id } = req.auth;
    const { id: target } = req.params;
    if (target === id) {
        res.status(404).send({ error: 'Chat no encontrado' });
        return;
    }
    try {
        const targetUser = await chatRepository.getContact(target);
        if (!targetUser) {
            res.status(404).send({ error: 'El usuario no existe' });
        }
        const messages = await chatRepository.getMessages(id, target);
        res.send({
            user: target,
            messages,
        });
    } catch (error) {
        next(error);
    }
};

const getContact = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

const addContact = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

const addMessage = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getContacts,
    getContact,
    addContact,
    addMessage,
    getMessages,
};
