const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String
});

let ROLE = mongoose.model("ROLE", roleSchema);

module.exports = ROLE;