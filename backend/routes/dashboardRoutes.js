const express = require("express");

const Book = require("../models/Book");
const Student = require("../models/Student");
const Issue = require("../models/Issue");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);


// =====================================
// DASHBOARD STATISTICS
// GET /api/dashboard
// =====================================

router.get("/", async (req, res) => {

    try {

        // =====================================
        // BASIC STATISTICS
        // =====================================

        // Total books
        const totalBooks =
            await Book.countDocuments();


        // Total students
        const totalStudents =
            await Student.countDocuments();


        // Currently issued
        const issuedBooks =
            await Issue.countDocuments({
                status: "Issued"
            });


        // Returned books
        const returnedBooks =
            await Issue.countDocuments({
                status: "Returned"
            });


        // =====================================
        // TOTAL FINE
        // =====================================

        const fineResult =
            await Issue.aggregate([
                {
                    $group: {
                        _id: null,

                        totalFine: {
                            $sum: "$fine"
                        }
                    }
                }
            ]);


        const totalFine =
            fineResult.length > 0
                ? fineResult[0].totalFine
                : 0;


        // =====================================
        // AVAILABLE BOOKS
        // =====================================

        const books =
            await Book.find();


        let availableBooks = 0;


        books.forEach(book => {

            availableBooks +=
                book.available;

        });


        // =====================================
        // OVERDUE BOOKS
        // =====================================

        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const overdueBooks =
            await Issue.countDocuments({

                status: "Issued",

                dueDate: {
                    $lt: today
                }

            });


        // =====================================
        // RECENT ISSUES
        // =====================================

        const recentIssues =
            await Issue.find()

                .populate(
                    "student",
                    "name studentId"
                )

                .populate(
                    "book",
                    "title author"
                )

                .sort({
                    createdAt: -1
                })

                .limit(5);


        // =====================================
        // MOST ISSUED BOOKS
        // =====================================

        const mostIssuedBooks =
            await Issue.aggregate([

                {
                    $group: {

                        _id: "$book",

                        issueCount: {
                            $sum: 1
                        }

                    }
                },

                {
                    $sort: {
                        issueCount: -1
                    }
                },

                {
                    $limit: 5
                },

                {
                    $lookup: {

                        from: "books",

                        localField: "_id",

                        foreignField: "_id",

                        as: "book"

                    }
                },

                {
                    $unwind: {
                        path: "$book",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $project: {

                        _id: 0,

                        bookId: "$_id",

                        title: "$book.title",

                        author: "$book.author",

                        issueCount: 1

                    }
                }

            ]);


        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            message:
                "Dashboard data fetched successfully",


            dashboard: {

                // Existing statistics
                totalBooks:
                    totalBooks,

                availableBooks:
                    availableBooks,

                issuedBooks:
                    issuedBooks,

                returnedBooks:
                    returnedBooks,

                totalStudents:
                    totalStudents,

                totalFine:
                    totalFine,


                // New statistics
                overdueBooks:
                    overdueBooks,

                recentIssues:
                    recentIssues,

                mostIssuedBooks:
                    mostIssuedBooks

            }

        });


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        res.status(500).json({

            message:
                "Error fetching dashboard data",

            error:
                error.message

        });

    }

});


module.exports = router;