const User = require("../models/user");
const bcrypt = require("bcrypt");

// ==========================================
// GET PROFILE
// ==========================================

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

exports.updateProfile = async (req, res) => {
    try {

        const {
            name,
            username,
            email,
            phone
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update only fields that were provided
        if (name !== undefined) {
            user.name = name;
        }

        if (username !== undefined) {
            user.username = username;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .select("-password");

        return res.json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {

        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};


// ==========================================
// UPDATE PROFILE PICTURE
// ==========================================

exports.updateProfilePicture = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required."
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // IMPORTANT:
        // multer saves file inside backend/uploads/
        const profilePicture =
            `/uploads/${req.file.filename}`;

        user.profilePicture = profilePicture;

        await user.save();

        return res.json({
            success: true,
            message: "Profile picture updated successfully.",
            profilePicture: profilePicture
        });

    } catch (error) {

        console.error(
            "Profile Picture Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Server error while uploading profile picture."
        });
    }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

exports.changePassword = async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters."
            });
        }

        const user =
            await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect."
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password = hashedPassword;

        await user.save();

        return res.json({
            success: true,
            message:
                "Password changed successfully."
        });

    } catch (error) {

        console.error(
            "Change Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while changing password."
        });
    }
};