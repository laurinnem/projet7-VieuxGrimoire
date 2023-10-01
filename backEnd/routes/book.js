const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookController = require("../controllers/book");

router.post("/", auth, multer, bookController.createBook);
router.put("/:id", auth, multer, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/:id", bookController.getOneBook);
router.get("/", bookController.getAllBooks);

//new
// router.get("/bestrating", bookController.getBestRatings);
// router.post("/:id/rating", bookController.createRating);

module.exports = router;
