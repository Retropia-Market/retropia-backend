const axios = require('axios');

const getRawgVideoGameInfo = async (req, res, next) => {
    try {
        const { game } = req.params;
        const apiURL = `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${game}&search_exact=1`;
        const { data } = await axios.get(apiURL, {
            headers: {
                'Content-type': 'application/json',
                token: 'Token ' + process.env.REACT_APP_RAWG_API_KEY,
            },
        });
        res.send(data);
    } catch (error) {
        next(error);
    }
};
const getRawgConsoleInfo = async (req, res, next) => {
    try {
        const apiURL = `https://api.rawg.io/api/platforms?key=${process.env.REACT_APP_RAWG_API_KEY}`;
        const { data } = await axios.get(apiURL, {
            headers: {
                'Content-type': 'application/json',
                token: 'Token ' + process.env.REACT_APP_RAWG_API_KEY,
            },
        });
        res.send(data);
    } catch (error) {
        next(error);
    }
};

module.exports = { getRawgVideoGameInfo, getRawgConsoleInfo };
