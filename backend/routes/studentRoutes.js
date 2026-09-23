const express = require("express");
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
// ===============================
// ADD STUDENT
// POST /api/students/add
// ===============================
router.post("/add", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding student",
            error: error.message
        });
    }
});


// ===============================
// GET ALL STUDENTS
// GET /api/students
// ===============================
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json({
            message: "Students fetched successfully",
            students: students
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});


// ===============================
// UPDATE STUDENT
// PUT /api/students/:id
// ===============================
router.put("/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student: updatedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
});


// ===============================
// DELETE STUDENT
// DELETE /api/students/:id
// ===============================
router.delete("/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});


module.exports = router;