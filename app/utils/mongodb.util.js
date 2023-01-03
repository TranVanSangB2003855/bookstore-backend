const mongoose = require("mongoose");
const ROLE = require("../models/role.model.js");

async function initial() {
    ROLE.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new ROLE({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            new ROLE({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

class MongoDB{
    static connect = async (uri) => {
        if(this.client) return this.client;
        this.client = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }).then(() => {
                initial();
              });
        
        return this.client;
    }
}

module.exports = MongoDB;