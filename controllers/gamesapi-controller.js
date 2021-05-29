const axios = require('axios');

//TODO-

const getGameInfo = async (req, res, next) => {
    try {
        const apiURL = 'https://api.igdb.com/v4/search/';
        const { game } = req.params;
        const { data } = await axios.post(
            apiURL,
            { method: 'POST' },
            {
                headers: {
                    Accept: 'application/json',
                    'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_TOKEN,
                    Authorization:
                        'Bearer ' + process.env.REACT_APP_TWITCH_ACCESS_TOKEN,
                },
            },
            { data: { name: game } }
        );
        res.send(data);
    } catch (error) {
        next(error);
    }
};

const getRawgInfo = async (req, res, next) => {
    try {
        const { game } = req.params;
        const apiURL = `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${game}`;
        const { data } = await axios.get(apiURL, {
            headers: {
                'Content-type': 'application/json',
                token: 'Token ' + process.env.REACT_APP_RAWG_API_KEY,
            },
        });
        console.log(data);
        res.send(data);
    } catch (error) {
        next(error);
    }
};

module.exports = { getGameInfo, getRawgInfo };
