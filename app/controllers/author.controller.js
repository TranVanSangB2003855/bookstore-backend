const AUTHOR = require("../models/author.model");
const ApiError = require("../api-error");

const authorController = {
    addAnAuthor: async (req, res, next) => {
        try {
            const newAuthor = new AUTHOR(req.body);
            const savedAuthor = await newAuthor.save();
            return res.send(savedAuthor);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while add an author`)
            );
        }
    },

    getAllAuthors: async (req, res, next) => {
        try {
            const authors = await AUTHOR.find({},{full_name: 1});
            return res.send(authors);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while get all authors`)
            );
        }
    },

    getAnAuthor: async (req, res, next) => {
        try {
            const author = await AUTHOR.findById(req.params.id).populate("books");
            return res.send(author);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while get a author`)
            );
        }
    }
}

module.exports = authorController;