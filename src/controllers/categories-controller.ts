const { categoriesRepository } = require('../repositories');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesRepository.getCategories();
    res.send(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
};
