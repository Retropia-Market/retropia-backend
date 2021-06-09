const { validateAuthorization } = require('./validate-auth');
const { uploadProductImage } = require('./uploadProductImg');
const uploadImg = require('./upload-img');
const { isCorrectUser } = require('./isCorrectUser');

module.exports = {
  validateAuthorization,
  uploadProductImage,
  uploadImg,
  isCorrectUser,
};
