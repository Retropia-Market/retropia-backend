import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const uploadUserImg = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = path.join(__dirname, '../static/users-img');
      !fs.existsSync(folder) ? fs.mkdirSync(folder, { recursive: true }) : null;
      cb(null, 'src/static/users-img/');
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
