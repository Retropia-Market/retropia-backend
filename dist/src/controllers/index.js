"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesApiController = exports.categoriesController = exports.favouritesController = exports.bidsController = exports.reviewsController = exports.productsController = exports.usersController = void 0;
const usersController = __importStar(require("./users-controller"));
exports.usersController = usersController;
const reviewsController = __importStar(require("./reviews-controller"));
exports.reviewsController = reviewsController;
const productsController = __importStar(require("./products-controllers"));
exports.productsController = productsController;
const bidsController = __importStar(require("./bids-controllers"));
exports.bidsController = bidsController;
const favouritesController = __importStar(require("./favourites-controller"));
exports.favouritesController = favouritesController;
const categoriesController = __importStar(require("./categories-controller"));
exports.categoriesController = categoriesController;
const gamesApiController = __importStar(require("./gamesapi-controller"));
exports.gamesApiController = gamesApiController;
//# sourceMappingURL=index.js.map