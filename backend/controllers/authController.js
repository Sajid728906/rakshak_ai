const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================
// SIGNUP
// =========================
exports.signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hash
        });


        user.lastLogin = new Date();

           await user.save();

        res.status(201).json({
            success: true,
            message: "Signup Successful",
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Wrong Password"
            });

        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({

            success: true,

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =========================
// PROFILE
// =========================
exports.profile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json(user);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};