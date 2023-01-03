const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    full_name: { type: String, require: true },
    year: { type: Number},
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "BOOK"}]
})

let AUTHOR = mongoose.model("AUTHOR", authorSchema);

module.exports = AUTHOR;