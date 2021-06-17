async function getBidsNotifications(req, res, next) {
    try {
        const { id } = req.auth;
    } catch (error) {
        next(error);
    }
}

async function getReviewsNotifications(req, res, next) {
    try {
        const { id } = req.auth;
    } catch (error) {
        next(error);
    }
}

async function getMessagesNotifications(req, res, next) {
    try {
        const { id } = req.auth;
    } catch (error) {
        next(error);
    }
}

export {
    getBidsNotifications,
    getMessagesNotifications,
    getReviewsNotifications,
};
