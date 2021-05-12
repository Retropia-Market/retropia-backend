const { database } = require('../infrastructure');
const { format } = require('date-fns');

/**
 * Función para añadir el producto a la base de datos.
 *
 * @param {JSON} data Acepta un valor de tipo JSON.
 * @param {number} userId Acepta valor de tipo number.
 * @returns El producto ya creado y los valores que se generan.
 */

const addProductToSellList = async (data, userId) => {
    const saleStatus = 'En venta';
    const productQuery =
        'INSERT INTO products (seller_id, name, status, upload_date, location, price, sale_status, description) VALUES ( ?, ?, ?, curdate(), ?, ?, ?, ?)';
    const whatCategoryIsProductQuery =
        'SELECT * FROM sub_categories WHERE name = ?';

    const [resultSell] = await database.pool.query(productQuery, [
        userId,
        data.name,
        data.status,
        data.location,
        data.price,
        saleStatus,
        data.description,
    ]);
    const [subcategorySearch] = await database.pool.query(
        whatCategoryIsProductQuery,
        data.subcategory
    );

    const categoryQuery =
        'INSERT INTO products_has_subcategory(product_id, subcategory_id) VALUES (?, ?)';
    const [subcategoryInsert] = await database.pool.query(categoryQuery, [
        resultSell.insertId,
        subcategorySearch[0].id,
    ]);
    return findProductById(resultSell.insertId);
};

/**
 * Función para recuperar catálogos según filtros indicados.
 * @param {string} querySearch Acepta un string que indica el tipo de busqueda
 * @returns Catálogo de productos dependiendo si has indicado filtro o no.
 */

const getCatalogue = async (querySearch) => {
    let finalSearch;
    if (querySearch.category) {
        const getCatalogueQuery =
            'SELECT products.id, products.seller_id, products.name, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id WHERE categories.name = ?';
        const [products] = await database.pool.query(
            getCatalogueQuery,
            querySearch.category
        );
        finalSearch = products;
    } else if (querySearch.subcategory) {
        const getCatalogueQuery =
            'SELECT products.id, products.seller_id, products.name, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  INNER JOIN categories ON sub_categories.category_id = categories.id WHERE sub_categories.name = ?';
        const [products] = await database.pool.query(
            getCatalogueQuery,
            querySearch.subcategory
        );
        finalSearch = products;
    } else {
        const getCatalogueQuery = 'SELECT * FROM products';
        const [products] = await database.pool.query(getCatalogueQuery);
        finalSearch = products;
    }

    return finalSearch;
};

const getCatalogueByUserId = async (id) => {
    const getCatalogueByUserIdQuery =
        'SELECT products.id, products.seller_id, products.name, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria  FROM products  INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  WHERE products.seller_id = ?';
    const [getData] = await database.pool.query(getCatalogueByUserIdQuery, id);
    return getData;
};

const removeProductById = async (id) => {
    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    return await database.pool.query(deleteQuery, id);
};

/**
 * Funcion para devolver el producto por id.
 * @param {number} id
 * @returns JSON con los datos del articulo.
 */
const findProductById = async (id) => {
    const getSingleProduct =
        'SELECT products.id, products.seller_id, products.name, products.status, products.price, products.sale_status, products.location, products.description, sub_categories.name AS Subcategoria, products.views  FROM products INNER JOIN products_has_subcategory ON products.id = products_has_subcategory.product_id INNER JOIN sub_categories ON products_has_subcategory.subcategory_id = sub_categories.id  WHERE products.id = ?';
    const [product] = await database.pool.query(getSingleProduct, id);
    return product[0];
};

const getSingleProduct = async (id) => {
    const updateViews = 'UPDATE products SET views = views + 1 WHERE id = ?';
    const [view] = await database.pool.query(updateViews, id);
    const product = await findProductById(id);
    return product;
};

const updateProduct = async (data, id) => {
    await Object.keys(data).forEach(async (bodyKey) => {
        if (bodyKey != 'subcategory') {
            const updateQuery = `UPDATE products SET ${bodyKey} = ? WHERE id = ?`;
            const updateData = await database.pool.query(updateQuery, [
                data[bodyKey],
                id,
            ]);
        } else {
            await updateSubcategory(data, id);
        }
    });
    return await findProductById(id);
};

const updateSaleStatus = async (saleStatus, id) => {
    const eventDate = format(new Date(), 'yyyy/MM/dd');
    const date = saleStatus === 'vendido' ? eventDate : null;
    const updateQuery =
        'UPDATE products SET sale_status = ?, sale_date = ? WHERE id = ?';
    const updateSale = await database.pool.query(updateQuery, [
        saleStatus,
        date,
        id,
    ]);
    return findProductById(id);
};

const searchCatalogue = async (search) => {
    const term = `%${search}%`;
    const searchQuery = `SELECT * FROM products WHERE name LIKE ?`;
    const [searchData] = await database.pool.query(searchQuery, term);
    return searchData;
};

const updateSubcategory = async (data, id) => {
    const whatCategoryIsProductQuery =
        'SELECT * FROM sub_categories WHERE name = ?';
    const [subcategorySearch] = await database.pool.query(
        whatCategoryIsProductQuery,
        data.subcategory
    );

    const categoryQuery =
        'UPDATE products_has_subcategory SET subcategory_id = ? WHERE product_id = ?';
    const [subcategoryUpdate] = await database.pool.query(categoryQuery, [
        subcategorySearch[0].id,
        id,
    ]);
};

const getTopProducts = async () => {
    const getTopProducts = 'SELECT * FROM products ORDER BY views DESC LIMIT ?';
    const [data] = await database.pool.query(getTopProducts, 4);
    return data;
};

const getBidByProdAndUser = async (prodId, userId) => {
    //HAY QUE ACTUALIZAR BIDSREPOSITORY
    const selectbidByUserAndProduct =
        'SELECT * FROM bids WHERE product_id = ? AND user_id = ?';
    const [
        getDataBidByUserProd,
    ] = await database.pool.query(selectbidByUserAndProduct, [prodId, userId]);
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
};
