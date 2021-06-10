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
exports.chatRepository = exports.categoriesRepository = exports.favouritesRepository = exports.bidsRepository = exports.reviewsRepository = exports.imagesRepository = exports.productsRepository = exports.usersRepository = void 0;
const usersRepository = __importStar(require("./users-repository"));
exports.usersRepository = usersRepository;
const productsRepository = __importStar(require("./products-repository"));
exports.productsRepository = productsRepository;
const imagesRepository = __importStar(require("./images-repository"));
exports.imagesRepository = imagesRepository;
const reviewsRepository = __importStar(require("./reviews-repository"));
exports.reviewsRepository = reviewsRepository;
const bidsRepository = __importStar(require("./bids-repository"));
exports.bidsRepository = bidsRepository;
const favouritesRepository = __importStar(require("./favourites-repository"));
exports.favouritesRepository = favouritesRepository;
const categoriesRepository = __importStar(require("./categories-repository"));
exports.categoriesRepository = categoriesRepository;
const chatRepository = __importStar(require("./chat-repository"));
exports.chatRepository = chatRepository;
//# sourceMappingURL=index.js.map