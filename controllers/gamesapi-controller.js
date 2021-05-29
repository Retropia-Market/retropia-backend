const axios = require('axios');

const getRawgInfo = async (req, res, next) => {
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

module.exports = { getGameInfo, getRawgInfo };
