const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MINE_TYPE_MAP = {
  "video/mp4": "mp4",
  "video/ogg": "ogg",
  "video/webm": "webm",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MINE_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error(`Invalid Mmine type`);
    cb(error, isValid);
  },
});

module.exports = fileUpload;
