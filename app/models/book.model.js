const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: [String], require: true },
    image: { type: [String], require: true },
    publishing_house: { type: String, require: true },
    publishing_year: { type: Number, require: true },
    supplier: { type: String, require: true },
    // heart: { type: Boolean},
    num_pages: { type: Number, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "AUTHOR"},
    desc: { type: String, require: true}
})

bookSchema.index({ title: 'text'});

let BOOK = mongoose.model("BOOK", bookSchema);
BOOK.createIndexes();

module.exports = BOOK;