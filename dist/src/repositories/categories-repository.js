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
exports.getCategories = void 0;
const infrastructure_1 = require("../infrastructure");
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'select sub_categories.* , categories.name as categoria from sub_categories inner join categories on sub_categories.category_id = categories.id';
    const [categories] = yield infrastructure_1.database.query(query);
    return categories;
});
exports.getCategories = getCategories;
//# sourceMappingURL=categories-repository.js.map