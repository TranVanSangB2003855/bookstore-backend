const authors = require("../controllers/author.controller");

const router = require("express").Router();

router.route("/")
    .post(authors.addAnAuthor)
    .get(authors.getAllAuthors);

router.route("/:id")
    .get(authors.getAnAuthor);

module.exports = router;