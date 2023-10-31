const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");

const bookController = require("../controllers/book");

router.get("/bestrating", bookController.bestRatings);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getOneBook);
router.post("/", auth, multer, sharp, bookController.createBook);
router.put("/:id", auth, multer, sharp, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);
router.post("/:id/rating", bookController.addRating);

module.exports = router;
