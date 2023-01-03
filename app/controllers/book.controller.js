const AUTHOR = require("../models/author.model");
const BOOK = require("../models/book.model");
const ApiError = require("../api-error");

async function phanTrang(category, fields, limit, page) {
    const tempt = []; let i = 0;
    do {
        let t = [];
        if (category.length !== 0)
            t = await BOOK.find({ "category": category }, fields).limit(limit).skip(limit * i)
        else {
            t = await BOOK.find({}, fields).limit(limit).skip(limit * i)
        }
        if (t.length === 0) {
            break;
        } else if (t.length < limit) {
            tempt.push(t);
            break;
        }
        tempt.push(t);
        i++;
    } while (i < page);
    return tempt;
}

const bookController = {
    addABook: async (req, res, next) => {
        try {
            const newBook = new BOOK(req.body);
            const savedBook = await newBook.save();
            if (req.body.author) {
                const author = AUTHOR.findById(req.body.author);
                await author.updateOne({
                    $push: { books: savedBook._id }
                });
            }
            return res.send(savedBook);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while add a book`)
            );
        }
    },

    getAllBooks: async (req, res, next) => {
        try {
            const books = await BOOK.find({}, {
                title: 1,
                price: 1
            });
            return res.send(books);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getDataHome: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                category: 1,
                image: 1
            }
            const sachGiaoKhoa = await phanTrang("Sách Giáo Khoa - Tham Khảo", fields, 4, 3);
            const sachThieuNhi = await phanTrang("Sách Thiếu Nhi", fields, 4, 3);
            const sachKyNang = await phanTrang("Sách Kĩ Năng", fields, 4, 3);
            return res.send({ sachGiaoKhoa, sachThieuNhi, sachKyNang });
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getDataSuggest: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                category: 1,
                image: 1
            }
            let loaiSach = []; let i = 0;
            do {
                let t = await BOOK.find({ $and: [{ "category": req.params.caterogy }, { "_id": { $nin: [req.params.id] } }] }, fields).limit(4).skip(4 * i)

                if (t.length === 0) {
                    break;
                } else if (t.length < 4) {
                    loaiSach.push(t);
                    break;
                }
                loaiSach.push(t);
                i++;
            } while (i < 3);
            return res.send(loaiSach);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getAll books`)
            );
        }
    },

    getData: async (req, res, next) => {
        try {
            const fields = {
                title: 1,
                price: 1,
                category: 1,
                image: 1
            }
            if (!req.query.category || req.query.category === "all") {
                if (req.query.search) {
                    console.log(req.query.search)
                    const tempt = []; let i = 0;
                    do {
                        let t = [];
                        if (req.query.search.length !== 0)
                            t = await BOOK.find({ $text: { $search: req.query.search } }, fields).limit(12).skip(12 * i)
                        else {
                            t = await BOOK.find({}, fields).limit(12).skip(12 * i)
                        }
                        if (t.length === 0) {
                            break;
                        } else if (t.length < 12) {
                            tempt.push(t);
                            break;
                        }
                        tempt.push(t);
                        i++;
                    } while (i < 50);
                    return res.send(tempt)
                }
                return res.send(await phanTrang("", fields, 12, 50));
            } else {
                return res.send(await phanTrang(req.query.category, fields, 12, 50));
            }
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while getData books`)
            );
        }
    },

    getABook: async (req, res, next) => {
        try {
            const book = await BOOK.findById(req.params.id).populate("author");
            return res.send(book);
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while get a book`)
            );
        }
    },

    updateBook: async (req, res, next) => {
        try {
            const book = await BOOK.findById(req.params.id);

            if (req.body.author !== book.author) {
                await AUTHOR.updateMany({ books: req.params.id }, { $pull: { books: req.params.id } })                      // Được thiết kế bởi Trần Văn Sáng

                const author = AUTHOR.findById(req.body.author);
                await author.updateOne({
                    $push: { books: req.params.id }
                });
            }

            await book.updateOne({ $set: req.body });
            return res.send({ message: " Book was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while update book`)
            );
        }
    },

    deleteABook: async (req, res, next) => {
        try {
            await AUTHOR.updateMany({ books: req.params.id }, { $pull: { books: req.params.id } })
            const document = await BOOK.findByIdAndDelete(req.params.id);

            if (!document) {
                return next(new ApiError(404, "Book not found"));
            }
            return res.send({ message: " Book was deleted successfully" });

        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while delete a book`)
            );
        }
    }
}

module.exports = bookController;