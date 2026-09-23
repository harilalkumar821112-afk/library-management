const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// CREATE ADMIN
// ===============================

router.post("/register", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const existingAdmin =
            await Admin.findOne({ username });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({
            message: "Admin created successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error creating admin",
            error: error.message
        });

    }

});


// ===============================
// ADMIN LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const admin =
            await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token =
            jwt.sign(
                {
                    id: admin._id,
                    username: admin.username
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

        res.status(200).json({
            message: "Login successful",
            token: token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login error",
            error: error.message
        });

    }

});


// ===============================
// CHECK LOGIN
// ===============================

router.get("/verify", (req, res) => {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token =
        authHeader.split(" ")[1];

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        res.status(200).json({
            message: "Token is valid",
            admin: decoded
        });

    } catch (error) {

        res.status(401).json({
            message: "Invalid or expired token"
        });

    }

});


// ===============================
// CHANGE ADMIN PASSWORD
// ===============================

router.post("/change-password", protect, async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        // Check required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Minimum password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        // Find logged-in admin
        const admin =
            await Admin.findById(req.admin.id);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        // Check current password
        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                admin.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        // Prevent same password
        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                admin.password
            );

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            });
        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        // Update password
        admin.password = hashedPassword;

        await admin.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error("Change Password Error:", error);

        res.status(500).json({
            message: "Error changing password",
            error: error.message
        });

    }

});


module.exports = router;