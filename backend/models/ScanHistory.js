const mongoose = require("mongoose");

const scanHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "url",
                "email",
                "sms",
                "whatsapp",
                "phone",
                "qr",
                "image",
                "file",
                "text"
            ],
            default: "text"
        },

        content: {
            type: String,
            required: true
        },

        riskScore: {
            type: Number,
            default: 0
        },

        riskLevel: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "LOW"
        },

        threats: {
            type: [String],
            default: []
        },

        recommendation: {
            type: String,
            default: ""
        },

        blocked: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("ScanHistory", scanHistorySchema);