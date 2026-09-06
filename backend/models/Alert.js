const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "THREAT",
                "WARNING",
                "SAFE",
                "SYSTEM"
            ],
            default: "SYSTEM"
        },

        riskScore: {
            type: Number,
            default: 0
        },

        riskLevel: {
            type: String,
            default: "LOW"
        },

        isRead: {
            type: Boolean,
            default: false
        },

        scanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ScanHistory",
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Alert", alertSchema);