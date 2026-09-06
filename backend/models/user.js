const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        subscription: {
            type: String,
            default: "Free"
        },

        riskScore: {
            type: Number,
            default: 0
        },

        threatBlocked: {
            type: Number,
            default: 0
        },

        protectedDevices: {
            type: Number,
            default: 1
        },

        lastLogin: {
            type: Date,
            default: null
        },

        profilePictureInput: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);