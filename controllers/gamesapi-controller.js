const axios = require('axios');

const getGameInfo = (req, res, next) => {
    axios(apiURL, {
        method: 'POST',
        body: JSON.stringify({ search: 'zelda' }),
        headers: {
            'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_TOKEN,
            Authorization:
                'Bearer ' + process.env.REACT_APP_TWITCH_ACCESS_TOKEN,
        },
    });
};

module.exports = { getGameInfo };
