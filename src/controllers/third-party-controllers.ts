const axios = require('axios');
const vision = require('@google-cloud/vision');

const getRawgVideoGameInfo = async (req, res, next) => {
  try {
    const { game } = req.params;
    const apiURL = `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${game}&search_exact=1&ordering=-metacritic`;
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

const getGoogleVision = async (req, res, next) => {
  try {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: './.key.json',
    });
    const { file } = req;
    const [result] = await client.objectLocalization(file.path);
    const detection = result.localizedObjectAnnotations;
    res.send(result);
  } catch (err) {
    next(err);
  }
};
const getAutoComplete = async (req, res, next) => {
  try {
    const { input } = req.params;
    const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.AUTOCOMPLETE_API_KEY}`;
    const results = await axios.get(apiURL);
    res.send(results.data.predictions);
  } catch (error) {
    next(error);
  }
};

export {
  getRawgVideoGameInfo,
  getRawgConsoleInfo,
  getGoogleVision,
  getAutoComplete,
};
