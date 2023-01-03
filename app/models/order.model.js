const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "USER"},
    products: [
        {
            book_id: { type: mongoose.Schema.Types.ObjectId, ref: "BOOK"},
            quantity: { type: Number, require: true },
            price: { type: Number, require: true },
        }
    ],
    address: { type: String, require: true },
    totalPrice: { type: Number, default: 0 },
    time: { type: String, require: true },
    status: { type: Boolean, require: true }
})

let ORDER = mongoose.model("ORDER", orderSchema);

module.exports = ORDER ;