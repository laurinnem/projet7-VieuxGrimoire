const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");

router.post("/", bookController.createBook);
router.put("/:id", bookController.modifyBook);
router.delete("/:id", bookController.deleteBook);
router.get("/:id", bookController.getOneBook);
router.get("/", bookController.getAllBooks);

module.exports = router;
