const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const issueRoutes = require("./routes/issueRoutes");
const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/issues", issueRoutes);
app.get("/", (req, res) => {
    res.send("Library Management System API is running...");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });