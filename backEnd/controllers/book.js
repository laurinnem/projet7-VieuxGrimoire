const Book = require("../models/Book");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.bestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((bestRatedBooks) => res.status(200).json(bestRatedBooks))
    .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "livre modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "livre supprimé !" }))
            .catch((error) => res.status(404).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//verif
exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre." });
      } else {
        const grade = rating;
        book.ratings.push({ userId: userId, grade: grade });
        const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        const averageRating = totalRatings / book.ratings.length;
        book.averageRating = averageRating;
        book
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "Vous avez noté le livre!", id: book._id })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
