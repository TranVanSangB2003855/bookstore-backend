const books = require("../controllers/book.controller");

const router = require("express").Router();

router.route("/")
    .post(books.addABook)
    .get(books.getAllBooks);

router.route("/getdatahome")
    .get(books.getDataHome);

router.route("/getdata")
    .get(books.getData);

router.route("/getdatasuggest/:caterogy/:id")
    .get(books.getDataSuggest);

router.route("/:id")
    .get(books.getABook)
    .put(books.updateBook)
    .delete(books.deleteABook);

module.exports = router;