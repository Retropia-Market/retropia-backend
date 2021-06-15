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
exports.getSimilarProducts = exports.getBidByProdAndUser = exports.getSingleProduct = exports.getTopProducts = exports.getCatalogueByUserId = exports.searchCatalogue = exports.updateSaleStatus = exports.updateProduct = exports.removeProductById = exports.findProductById = exports.getCatalogue = exports.addProductToSellList = void 0;
const date_fns_1 = require("date-fns");
const infrastructure_1 = require("../infrastructure");
const images_repository_1 = require("./images-repository");
/**
 * Función para añadir el producto a la base de datos.
 *
 * @param {object} data Acepta un valor de tipo object.
 * @param {string} userId Acepta valor de tipo number.
 * @returns JSON con los datos del articulo.
 */
const addProductToSellList = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const saleStatus = 'En venta';
    const productQuery = 'INSERT INTO products (seller_id, name, status, upload_date, location, price, sale_status, description, product_type) VALUES ( ?, ?, ?, curdate(), ?, ?, ?, ?, ?)';
    const whatCategoryIsProductQuery = 'SELECT * FROM sub_categories WHERE name = ?';
    const [resultSell] = yield infrastructure_1.database.query(productQuery, [
        userId,
        data.name,
        data.status,
        data.location,
        data.price,
        saleStatus,
        data.description,
        data.product_type,
    ]);
    const [subcategorySearch] = yield infrastructure_1.database.query(whatCategoryIsProductQuery, data.subcategory);
    const categoryQuery = 'INSERT INTO products_has_subcategory (product_id, subcategory_id) VALUES (?, ?)';
    const [subcategoryInsert] = yield infrastructure_1.database.query(categoryQuery, [
        +resultSell.insertId,
        +subcategorySearch[0].id,
    ]);
    return findProductById(resultSell.insertId);
});
exports.addProductToSellList = addProductToSellList;
/**
 * Función para recuperar catálogos según filtros indicados.
 * @param {string} querySearch Acepta un string que indica el tipo de busqueda
 * @returns JSON con lista de articulos y sus datos, varia según el filtro indicado.
 */
const getCatalogue = (querySearch) => __awaiter(void 0, void 0, void 0, function* () {
    let finalSearch;
    if (querySearch.category) {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id WHERE categories.name = ?';
        const [products] = yield infrastructure_1.database.query(getCatalogueQuery, querySearch.category);
        finalSearch = products;
    }
    else if (querySearch.subcategory) {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.product_type, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id WHERE sub_categories.name = ?';
        const [products] = yield infrastructure_1.database.query(getCatalogueQuery, querySearch.subcategory);
        finalSearch = products;
    }
    else {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id';
        const [products] = yield infrastructure_1.database.query(getCatalogueQuery);
        finalSearch = products;
    }
    for (const prod of finalSearch) {
        const images = yield images_repository_1.findImageById(prod.id);
        prod.images = [...images];
    }
    return finalSearch;
});
exports.getCatalogue = getCatalogue;
/**
 * Función que recupera los productos en venta de un determinado usuario
 * @param {string} userId Id del usuario.
 * @returns JSON con lista de articulos y sus datos.
 */
const getCatalogueByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const getCatalogueByUserIdQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN users ON products.seller_id = users.id WHERE products.seller_id = ?';
    const [getData] = yield infrastructure_1.database.query(getCatalogueByUserIdQuery, userId);
    for (const prod of getData) {
        const images = yield images_repository_1.findImageById(prod.id);
        prod.images = [...images];
    }
    return getData;
});
exports.getCatalogueByUserId = getCatalogueByUserId;
/**
 * Función para borrar un producto.
 * @param {string} id Id del producto.
 * @returns null
 */
const removeProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    return yield infrastructure_1.database.query(deleteQuery, id);
});
exports.removeProductById = removeProductById;
/**
 * Funcion genérica para devolver el producto por id.
 * @param {string} id Id del producto.
 * @returns JSON con los datos del articulo.
 */
const findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const getSingleProduct = 'SELECT products.id, products.seller_id, users.username as seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views  FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN users ON products.seller_id = users.id WHERE products.id = ?';
    const [product] = yield infrastructure_1.database.query(getSingleProduct, id);
    const images = yield images_repository_1.findImageById(id);
    if (images && product[0])
        product[0].images = [...images];
    return product[0];
});
exports.findProductById = findProductById;
/**
 * Función que devuelve un único producto y aumenta las visitas del producto.
 * @param {string} id Id del producto.
 * @returns JSON con los datos del articulo.
 */
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updateViews = 'UPDATE products SET views = views + 1 WHERE id = ?';
    const [view] = yield infrastructure_1.database.query(updateViews, id);
    const product = yield findProductById(id);
    return product;
});
exports.getSingleProduct = getSingleProduct;
/**
 * Función para actualizar el producto.
 * @param {object} data Acepta un objeto con los valores
 * necesarios para actualizar el producto, no es necesario que se indiquen todos los valores.
 * @param {string} id Id del producto
 * @returns JSON con datos del producto
 */
const updateProduct = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    for (const bodyKey in data) {
        if (bodyKey != 'subcategory') {
            const updateQuery = `UPDATE products SET ${bodyKey} = ? WHERE id = ?`;
            const updateData = yield infrastructure_1.database.query(updateQuery, [
                data[bodyKey],
                id,
            ]);
        }
        else {
            yield updateSubcategory(data, id);
        }
    }
    return yield findProductById(id);
});
exports.updateProduct = updateProduct;
/**
 * Función que actualiza el estado de venta de un producto.
 *
 * @param {string} saleStatus El estado de venta del producto.
 * @param {string} id Id del producto.
 * @returns JSON con datos del producto.
 */
const updateSaleStatus = (saleStatus, id) => __awaiter(void 0, void 0, void 0, function* () {
    const eventDate = date_fns_1.format(new Date(), 'yyyy/MM/dd');
    const date = saleStatus === 'vendido' ? eventDate : null;
    const updateQuery = 'UPDATE products SET sale_status = ?, sale_date = ? WHERE id = ?';
    const updateSale = yield infrastructure_1.database.query(updateQuery, [
        saleStatus,
        date,
        id,
    ]);
    return findProductById(id);
});
exports.updateSaleStatus = updateSaleStatus;
/**
 * Funcion que busca el catálogo y devuelve lista de objetos según parámetro.
 * @param {string} search Parámetro de busqueda
 * @returns JSON  de lista de productos con los datos
 */
const searchCatalogue = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const term = `%${search}%`;
    const searchQuery = `SELECT * FROM products WHERE name LIKE ?`;
    const [searchData] = yield infrastructure_1.database.query(searchQuery, term);
    for (const prod of searchData) {
        const images = yield images_repository_1.findImageById(prod.id);
        prod.images = [...images];
    }
    return searchData;
});
exports.searchCatalogue = searchCatalogue;
/**
 * Funcion que actualiza la subcategoria de un producto.
 *
 * @param {object} data
 * @param {string} id
 */
const updateSubcategory = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const whatCategoryIsProductQuery = 'SELECT * FROM sub_categories WHERE name = ?';
    const [subcategorySearch] = yield infrastructure_1.database.query(whatCategoryIsProductQuery, data.subcategory);
    const categoryQuery = 'UPDATE products_has_subcategory SET subcategory_id = ? WHERE product_id = ?';
    const [subcategoryUpdate] = yield infrastructure_1.database.query(categoryQuery, [
        subcategorySearch[0].id,
        id,
    ]);
});
/**
 * Función que devuelve los productos mas visitados.
 * @returns JSON con lista de cuatro productos ordenados segun visitas.
 */
const getTopProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const getTopProducts = 'SELECT products.id, products.seller_id, users.firstname AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id ORDER BY views DESC LIMIT ?';
    const [data] = yield infrastructure_1.database.query(getTopProducts, 4);
    for (const prod of data) {
        const images = yield images_repository_1.findImageById(prod.id);
        prod.images = [...images];
    }
    return data;
});
exports.getTopProducts = getTopProducts;
const getSimilarProducts = (subCatName) => __awaiter(void 0, void 0, void 0, function* () {
    const getRelatedProducts = 'SELECT products.id, products.seller_id, products.name , users.username as seller, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS categoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON users.id = products.seller_id WHERE sub_categories.name = ? ORDER BY RAND() LIMIT 4';
    const [data] = yield infrastructure_1.database.query(getRelatedProducts, subCatName);
    for (const prod of data) {
        const images = yield images_repository_1.findImageById(prod.id);
        prod.images = [...images];
    }
    return data;
});
exports.getSimilarProducts = getSimilarProducts;
// TODO - Cambiar por función de bidRepository.
const getBidByProdAndUser = (prodId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //HAY QUE ACTUALIZAR BIDSREPOSITORY
    const selectbidByUserAndProduct = 'SELECT * FROM bids WHERE product_id = ? AND user_id = ?';
    const [getDataBidByUserProd] = yield infrastructure_1.database.query(selectbidByUserAndProduct, [prodId, userId]);
    return getDataBidByUserProd[0];
});
exports.getBidByProdAndUser = getBidByProdAndUser;
//# sourceMappingURL=products-repository.js.map