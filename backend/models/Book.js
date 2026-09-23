const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        isbn: {
            type: String,
            required: true,
            unique: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        available: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;