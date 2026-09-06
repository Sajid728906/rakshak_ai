// backend/utils/aiScanner.js

const suspiciousWords = [
    "urgent",
    "verify your account",
    "verify now",
    "click here",
    "password",
    "otp",
    "bank",
    "upi",
    "kyc",
    "blocked",
    "suspended",
    "lottery",
    "winner",
    "prize",
    "refund",
    "payment",
    "credit card",
    "debit card",
    "claim",
    "free money"
];

function analyzeText(text) {

    if (!text || typeof text !== "string") {
        return {
            riskScore: 0,
            riskLevel: "LOW",
            threats: [],
            recommendation: "No content provided."
        };
    }

    const lowerText = text.toLowerCase();

    const detectedThreats = [];

    suspiciousWords.forEach(word => {

        if (lowerText.includes(word)) {
            detectedThreats.push(word);
        }

    });

    let riskScore = detectedThreats.length * 10;

    // URL detection
    if (
        lowerText.includes("http://") ||
        lowerText.includes("https://")
    ) {
        riskScore += 10;
    }

    // Shortened URL detection
    const shortUrlDomains = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "is.gd"
    ];

    shortUrlDomains.forEach(domain => {

        if (lowerText.includes(domain)) {
            riskScore += 20;
        }

    });

    if (riskScore > 100) {
        riskScore = 100;
    }

    let riskLevel = "LOW";

    if (riskScore >= 70) {
        riskLevel = "CRITICAL";
    }
    else if (riskScore >= 40) {
        riskLevel = "HIGH";
    }
    else if (riskScore >= 20) {
        riskLevel = "MEDIUM";
    }

    let recommendation =
        "Content appears relatively safe.";

    if (riskLevel === "MEDIUM") {
        recommendation =
            "Be careful. Verify the sender before taking any action.";
    }

    if (riskLevel === "HIGH") {
        recommendation =
            "Do not click links or share personal information.";
    }

    if (riskLevel === "CRITICAL") {
        recommendation =
            "Potential scam detected. Do not click, reply, pay, or share OTP/password.";
    }

    return {

        riskScore,

        riskLevel,

        threats: detectedThreats,

        recommendation

    };

}

module.exports = {
    analyzeText
};