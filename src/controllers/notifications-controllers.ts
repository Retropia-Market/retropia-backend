import { notificationsRepository } from '../repositories';

const getBidsNotifications = async (req, res, next) => {
    try {
        const { id: uid } = req.auth;
        const results = await notificationsRepository.getBidsNotifications(uid);
        res.send(results);
    } catch (error) {
        next(error);
    }
};

const getReviewsNotifications = async (req, res, next) => {
    try {
        const { id: uid } = req.auth;
        const results = await notificationsRepository.getReviewsNotifications(
            uid
        );
        res.send(results);
    } catch (error) {
        next(error);
    }
};

const getMessagesNotifications = async (req, res, next) => {
    try {
        const { id: uid } = req.auth;
        const results = await notificationsRepository.getMessagesNotifications(
            uid
        );
        res.send(results);
    } catch (error) {
        next(error);
    }
};

const getSalesNotifications = async (req, res, next) => {
    try {
        const { id: uid } = req.auth;
        const results = await notificationsRepository.getSalesNotifications(
            uid
        );
        res.send(results);
    } catch (error) {
        next(error);
    }
};

export {
    getBidsNotifications,
    getMessagesNotifications,
    getReviewsNotifications,
    getSalesNotifications,
};
