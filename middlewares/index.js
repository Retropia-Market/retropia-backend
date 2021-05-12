const { validateAuthorization } = require('./validate-auth');
const { uploadProductImage } = require('./uploadProductImg');
const uploadImg = require('./upload-img');

module.exports = {
  validateAuthorization,
  uploadProductImage,
  uploadImg,
};
