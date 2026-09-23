const express = require("express");
const Book = require("../models/Book");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// JWT PROTECTION
// ===============================

router.use(protect);


// ===============================
// ADD BOOK
// POST /api/books/add
// ===============================

router.post("/add", async (req, res) => {

    try {

        const book = new Book(req.body);

        const savedBook = await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book: savedBook
        });

    } catch (error) {

        res.status(500).json({
            message: "Error adding book",
            error: error.message
        });

    }

});


// ===============================
// GET ALL BOOKS
// GET /api/books
// ===============================

router.get("/", async (req, res) => {

    try {

        const books = await Book.find();

        res.status(200).json({
            message: "Books fetched successfully",
            books: books
        });

    } catch (error) {

        res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });

    }

});


// ===============================
// UPDATE BOOK
// PUT /api/books/:id
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedBook =
            await Book.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedBook) {

            return res.status(404).json({
                message: "Book not found"
            });

        }


        res.status(200).json({

            message: "Book updated successfully",

            book: updatedBook

        });

    } catch (error) {

        res.status(500).json({

            message: "Error updating book",

            error: error.message

        });

    }

});


// ===============================
// DELETE BOOK
// DELETE /api/books/:id
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedBook =
            await Book.findByIdAndDelete(
                req.params.id
            );


        if (!deletedBook) {

            return res.status(404).json({
                message: "Book not found"
            });

        }


        res.status(200).json({

            message: "Book deleted successfully",

            book: deletedBook

        });

    } catch (error) {

        res.status(500).json({

            message: "Error deleting book",

            error: error.message

        });

    }

});


// ===============================
// EXPORT ROUTER
// ===============================

module.exports = router;