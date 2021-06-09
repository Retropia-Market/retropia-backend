const { database } = require('../infrastructure');
const { format } = require('date-fns');
const { findImageById } = require('./images-repository');
/**
 * Función para añadir el producto a la base de datos.
 *
 * @param {object} data Acepta un valor de tipo object.
 * @param {string} userId Acepta valor de tipo number.
 * @returns JSON con los datos del articulo.
 */
const addProductToSellList = async (data, userId) => {
    const saleStatus = 'En venta';
    const productQuery = 'INSERT INTO products (seller_id, name, status, upload_date, location, price, sale_status, description, product_type) VALUES ( ?, ?, ?, curdate(), ?, ?, ?, ?, ?)';
    const whatCategoryIsProductQuery = 'SELECT * FROM sub_categories WHERE name = ?';
    const [resultSell] = await database.pool.query(productQuery, [
        userId,
        data.name,
        data.status,
        data.location,
        data.price,
        saleStatus,
        data.description,
        data.product_type,
    ]);
    const [subcategorySearch] = await database.pool.query(whatCategoryIsProductQuery, data.subcategory);
    const categoryQuery = 'INSERT INTO products_has_subcategory (product_id, subcategory_id) VALUES (?, ?)';
    const [subcategoryInsert] = await database.pool.query(categoryQuery, [
        +resultSell.insertId,
        +subcategorySearch[0].id,
    ]);
    return findProductById(resultSell.insertId);
};
/**
 * Función para recuperar catálogos según filtros indicados.
 * @param {string} querySearch Acepta un string que indica el tipo de busqueda
 * @returns JSON con lista de articulos y sus datos, varia según el filtro indicado.
 */
const getCatalogue = async (querySearch) => {
    let finalSearch;
    if (querySearch.category) {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id WHERE categories.name = ?';
        const [products] = await database.pool.query(getCatalogueQuery, querySearch.category);
        finalSearch = products;
    }
    else if (querySearch.subcategory) {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.product_type, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id WHERE sub_categories.name = ?';
        const [products] = await database.pool.query(getCatalogueQuery, querySearch.subcategory);
        finalSearch = products;
    }
    else {
        const getCatalogueQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id';
        const [products] = await database.pool.query(getCatalogueQuery);
        finalSearch = products;
    }
    for (prod of finalSearch) {
        const images = await findImageById(prod.id);
        prod.images = [...images];
    }
    return finalSearch;
};
/**
 * Función que recupera los productos en venta de un determinado usuario
 * @param {string} userId Id del usuario.
 * @returns JSON con lista de articulos y sus datos.
 */
const getCatalogueByUserId = async (userId) => {
    const getCatalogueByUserIdQuery = 'SELECT products.id, products.seller_id, users.username AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN users ON products.seller_id = users.id WHERE products.seller_id = ?';
    const [getData] = await database.pool.query(getCatalogueByUserIdQuery, userId);
    for (prod of getData) {
        const images = await findImageById(prod.id);
        prod.images = [...images];
    }
    return getData;
};
/**
 * Función para borrar un producto.
 * @param {string} id Id del producto.
 * @returns null
 */
const removeProductById = async (id) => {
    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    return await database.pool.query(deleteQuery, id);
};
/**
 * Funcion genérica para devolver el producto por id.
 * @param {string} id Id del producto.
 * @returns JSON con los datos del articulo.
 */
const findProductById = async (id) => {
    const getSingleProduct = 'SELECT products.id, products.seller_id, users.username as seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views  FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id INNER JOIN users ON products.seller_id = users.id WHERE products.id = ?';
    const [product] = await database.pool.query(getSingleProduct, id);
    const images = await findImageById(id);
    if (images && product[0])
        product[0].images = [...images];
    return product[0];
};
/**
 * Función que devuelve un único producto y aumenta las visitas del producto.
 * @param {string} id Id del producto.
 * @returns JSON con los datos del articulo.
 */
const getSingleProduct = async (id) => {
    const updateViews = 'UPDATE products SET views = views + 1 WHERE id = ?';
    const [view] = await database.pool.query(updateViews, id);
    const product = await findProductById(id);
    return product;
};
/**
 * Función para actualizar el producto.
 * @param {object} data Acepta un objeto con los valores
 * necesarios para actualizar el producto, no es necesario que se indiquen todos los valores.
 * @param {string} id Id del producto
 * @returns JSON con datos del producto
 */
const updateProduct = async (data, id) => {
    for (bodyKey in data) {
        if (bodyKey != 'subcategory') {
            const updateQuery = `UPDATE products SET ${bodyKey} = ? WHERE id = ?`;
            const updateData = await database.pool.query(updateQuery, [
                data[bodyKey],
                id,
            ]);
        }
        else {
            await updateSubcategory(data, id);
        }
    }
    return await findProductById(id);
};
/**
 * Función que actualiza el estado de venta de un producto.
 *
 * @param {string} saleStatus El estado de venta del producto.
 * @param {string} id Id del producto.
 * @returns JSON con datos del producto.
 */
const updateSaleStatus = async (saleStatus, id) => {
    const eventDate = format(new Date(), 'yyyy/MM/dd');
    const date = saleStatus === 'vendido' ? eventDate : null;
    const updateQuery = 'UPDATE products SET sale_status = ?, sale_date = ? WHERE id = ?';
    const updateSale = await database.pool.query(updateQuery, [
        saleStatus,
        date,
        id,
    ]);
    return findProductById(id);
};
/**
 * Funcion que busca el catálogo y devuelve lista de objetos según parámetro.
 * @param {string} search Parámetro de busqueda
 * @returns JSON  de lista de productos con los datos
 */
const searchCatalogue = async (search) => {
    const term = `%${search}%`;
    const searchQuery = `SELECT * FROM products WHERE name LIKE ?`;
    const [searchData] = await database.pool.query(searchQuery, term);
    for (prod of searchData) {
        const images = await findImageById(prod.id);
        prod.images = [...images];
    }
    return searchData;
};
/**
 * Funcion que actualiza la subcategoria de un producto.
 *
 * @param {object} data
 * @param {string} id
 */
const updateSubcategory = async (data, id) => {
    const whatCategoryIsProductQuery = 'SELECT * FROM sub_categories WHERE name = ?';
    const [subcategorySearch] = await database.pool.query(whatCategoryIsProductQuery, data.subcategory);
    const categoryQuery = 'UPDATE products_has_subcategory SET subcategory_id = ? WHERE product_id = ?';
    const [subcategoryUpdate] = await database.pool.query(categoryQuery, [
        subcategorySearch[0].id,
        id,
    ]);
};
/**
 * Función que devuelve los productos mas visitados.
 * @returns JSON con lista de cuatro productos ordenados segun visitas.
 */
const getTopProducts = async () => {
    const getTopProducts = 'SELECT products.id, products.seller_id, users.firstname AS seller, products.name, products.status, products.product_type, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON products.seller_id = users.id ORDER BY views DESC LIMIT ?';
    const [data] = await database.pool.query(getTopProducts, 4);
    for (prod of data) {
        const images = await findImageById(prod.id);
        prod.images = [...images];
    }
    return data;
};
const getSimilarProducts = async (subCatName) => {
    const getRelatedProducts = 'SELECT products.id, products.seller_id, products.name , users.username as seller, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS categoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id INNER JOIN users ON users.id = products.seller_id WHERE sub_categories.name = ? ORDER BY RAND() LIMIT 4';
    const [data] = await database.pool.query(getRelatedProducts, subCatName);
    for (prod of data) {
        const images = await findImageById(prod.id);
        prod.images = [...images];
    }
    return data;
};
// TODO - Cambiar por función de bidRepository.
const getBidByProdAndUser = async (prodId, userId) => {
    //HAY QUE ACTUALIZAR BIDSREPOSITORY
    const selectbidByUserAndProduct = 'SELECT * FROM bids WHERE product_id = ? AND user_id = ?';
    const [getDataBidByUserProd] = await database.pool.query(selectbidByUserAndProduct, [prodId, userId]);
    return getDataBidByUserProd[0];
};
module.exports = {
    addProductToSellList,
    getCatalogue,
    findProductById,
    removeProductById,
    updateProduct,
    updateSaleStatus,
    searchCatalogue,
    getCatalogueByUserId,
    getTopProducts,
    getSingleProduct,
    getBidByProdAndUser,
    getSimilarProducts,
};
