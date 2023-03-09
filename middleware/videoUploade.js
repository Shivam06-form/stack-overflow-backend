const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MINE_TYPE_MAP = {
  "video/mp4": "mp4",
  "video/ogg": "ogg",
  "video/webm": "webm",
  "video/mp4": "mp4",
  "video/ogg": "ogg",
  "video/webm": "webm",
};

const fileUpload = multer({
  limits: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/videos");
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
