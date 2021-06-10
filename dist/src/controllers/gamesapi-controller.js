"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutoComplete = exports.getGoogleVision = exports.getRawgConsoleInfo = exports.getRawgVideoGameInfo = void 0;
const axios = require('axios');
const vision = require('@google-cloud/vision');
const getRawgVideoGameInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { game } = req.params;
        const apiURL = `https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${game}&search_exact=1&ordering=-metacritic`;
        const { data } = yield axios.get(apiURL, {
            headers: {
                'Content-type': 'application/json',
                token: 'Token ' + process.env.REACT_APP_RAWG_API_KEY,
            },
        });
        res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getRawgVideoGameInfo = getRawgVideoGameInfo;
const getRawgConsoleInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiURL = `https://api.rawg.io/api/platforms?key=${process.env.REACT_APP_RAWG_API_KEY}`;
        const { data } = yield axios.get(apiURL, {
            headers: {
                'Content-type': 'application/json',
                token: 'Token ' + process.env.REACT_APP_RAWG_API_KEY,
            },
        });
        res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.getRawgConsoleInfo = getRawgConsoleInfo;
const getGoogleVision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: './key.json',
        });
        const { file } = req;
        const [result] = yield client.objectLocalization(file.path);
        const detection = result.localizedObjectAnnotations;
        res.send(detection);
    }
    catch (err) {
        next(err);
    }
});
exports.getGoogleVision = getGoogleVision;
const getAutoComplete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input } = req.params;
        const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.AUTOCOMPLETE_API_KEY}`;
        const results = yield axios.get(apiURL);
        res.send(results.data.predictions);
    }
    catch (error) {
        next(error);
    }
});
exports.getAutoComplete = getAutoComplete;
//# sourceMappingURL=gamesapi-controller.js.map