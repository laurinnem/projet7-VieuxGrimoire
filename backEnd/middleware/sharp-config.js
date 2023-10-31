const multer = require("multer");
const sharpMulter = require("sharp-multer");

const sharpOptions = {
  resize: {
    width: 250,
  },
  toFormat: "webp",
};

const processImage = sharpMulter({
  sharp: sharpOptions,
  storageEngine: multer.diskStorage({
    // enregistre l'image redimensionnée
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split(" ").join("_");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, name + uniqueSuffix);
    },
  }),
});

module.exports = processImage;
