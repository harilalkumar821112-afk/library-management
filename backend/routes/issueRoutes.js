const express = require("express");
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);


// =====================================
// ISSUE BOOK
// POST /api/issues/issue
// =====================================

router.post("/issue", async (req, res) => {

    try {

        const {
            studentId,
            bookId,
            dueDate
        } = req.body;


        // Find student
        const student =
            await Student.findById(studentId);


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        // Find book
        const book =
            await Book.findById(bookId);


        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });

        }


        // Check availability
        if (book.available <= 0) {

            return res.status(400).json({
                message: "Book is not available"
            });

        }


        // Check due date
        if (!dueDate) {

            return res.status(400).json({
                message: "Due date is required"
            });

        }


        // Create issue record
        const issue = new Issue({

            student: studentId,

            book: bookId,

            dueDate: dueDate

        });


        const savedIssue =
            await issue.save();


        // Decrease available book quantity
        book.available =
            book.available - 1;


        await book.save();


        res.status(201).json({

            message:
                "Book issued successfully",

            issue: savedIssue

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error issuing book",

            error:
                error.message

        });

    }

});


// =====================================
// RETURN BOOK
// PUT /api/issues/return/:id
// =====================================

router.put("/return/:id", async (req, res) => {

    try {

        // Find issue record
        const issue =
            await Issue.findById(
                req.params.id
            );


        if (!issue) {

            return res.status(404).json({

                message:
                    "Issue record not found"

            });

        }


        // Check if already returned
        if (issue.status === "Returned") {

            return res.status(400).json({

                message:
                    "Book is already returned"

            });

        }


        // Find book
        const book =
            await Book.findById(
                issue.book
            );


        if (!book) {

            return res.status(404).json({

                message:
                    "Book not found"

            });

        }


        // =====================================
        // CURRENT DATE
        // =====================================

        const returnDate =
            new Date();


        // =====================================
        // CORRECT FINE CALCULATION
        // =====================================

        const dueDate =
            new Date(issue.dueDate);


        // Remove time from both dates
        // This prevents same-day returns
        // from getting ₹10 fine.

        dueDate.setHours(
            0,
            0,
            0,
            0
        );


        returnDate.setHours(
            0,
            0,
            0,
            0
        );


        let fine = 0;


        // Calculate only if returned after due date
        if (returnDate > dueDate) {

            const difference =
                returnDate.getTime() -
                dueDate.getTime();


            const lateDays =
                Math.floor(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            // ₹10 per late day
            fine =
                lateDays * 10;

        }


        // =====================================
        // UPDATE ISSUE
        // =====================================

        issue.returnDate =
            new Date();


        issue.fine =
            fine;


        issue.status =
            "Returned";


        await issue.save();


        // =====================================
        // INCREASE AVAILABLE BOOKS
        // =====================================

        book.available =
            book.available + 1;


        await book.save();


        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            message:
                "Book returned successfully",

            fine:
                fine,

            issue:
                issue

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error returning book",

            error:
                error.message

        });

    }

});


// =====================================
// GET ALL ISSUE RECORDS
// GET /api/issues
// =====================================

router.get("/", async (req, res) => {

    try {

        const issues =
            await Issue.find()
                .populate("student")
                .populate("book");


        res.status(200).json({

            message:
                "Issue records fetched successfully",

            issues:
                issues

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error fetching issue records",

            error:
                error.message

        });

    }

});


module.exports = router;