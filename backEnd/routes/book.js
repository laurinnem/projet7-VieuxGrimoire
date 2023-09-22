const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const bookController = require("../controllers/book");

router.post("/", auth, bookController.createBook);
router.put("/:id", auth, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/:id", auth, bookController.getOneBook);
router.get("/", auth, bookController.getAllBooks);

module.exports = router;
