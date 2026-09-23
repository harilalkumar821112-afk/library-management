const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        course: {
            type: String,
            required: true
        },

        semester: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;