const ScanHistory = require("../models/ScanHistory");
const User = require("../models/user");
const Alert = require("../models/Alert");

const {
    analyzeText
} = require("../utils/aiScanner");


// ==========================================
// AI SCAN
// ==========================================

exports.scan = async (req, res) => {

    try {

        const {
            content,
            type = "text"
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!content || !content.trim()) {

            return res.status(400).json({

                success: false,

                message: "Content is required"

            });

        }


        // ==========================================
        // AI ANALYSIS
        // ==========================================

        const result =
            analyzeText(content);


        // ==========================================
        // BLOCKED THREAT
        // ==========================================

        const blocked =
            result.riskLevel === "HIGH" ||
            result.riskLevel === "CRITICAL";


        // ==========================================
        // SAVE SCAN
        // ==========================================

        const scan =
            await ScanHistory.create({

                user: req.user.id,

                type,

                content,

                riskScore:
                    result.riskScore,

                riskLevel:
                    result.riskLevel,

                threats:
                    result.threats,

                recommendation:
                    result.recommendation,

                blocked

            });


        // ==========================================
        // UPDATE USER STATS
        // ==========================================

        const user =
            await User.findById(
                req.user.id
            );


        if (user) {

            // Latest risk score

            user.riskScore =
                result.riskScore;


            // Increase blocked threats

            if (blocked) {

                user.threatBlocked =
                    (user.threatBlocked || 0) + 1;

            }


            await user.save();

        }


        // ==========================================
        // AUTOMATIC ALERT CREATION
        // ==========================================

        let alertType = "SAFE";

        let alertTitle =
            "Security Scan Completed";

        let alertMessage =
            "No significant threat detected.";


        // ==========================================
        // CRITICAL / HIGH
        // ==========================================

        if (result.riskScore >= 80) {

            alertType =
                "THREAT";

            alertTitle =
                "Critical Security Threat Detected";

            alertMessage =
                `A critical threat was detected during your ${type} scan. Risk Score: ${result.riskScore}/100`;

        }


        // ==========================================
        // MEDIUM
        // ==========================================

        else if (result.riskScore >= 50) {

            alertType =
                "WARNING";

            alertTitle =
                "Suspicious Activity Detected";

            alertMessage =
                `Suspicious activity was detected during your ${type} scan. Risk Score: ${result.riskScore}/100`;

        }


        // ==========================================
        // SAVE ALERT
        // ==========================================

        await Alert.create({

            user: req.user.id,

            title:
                alertTitle,

            message:
                alertMessage,

            type:
                alertType,

            riskScore:
                result.riskScore,

            riskLevel:
                result.riskLevel,

            scanId:
                scan._id

        });


        // ==========================================
        // RESPONSE
        // ==========================================

        res.json({

            success: true,

            message:
                "Scan completed successfully",

            scan: {

                id:
                    scan._id,

                type:
                    scan.type,

                riskScore:
                    scan.riskScore,

                riskLevel:
                    scan.riskLevel,

                threats:
                    scan.threats,

                recommendation:
                    scan.recommendation,

                blocked:
                    scan.blocked,

                createdAt:
                    scan.createdAt

            }

        });

    }

    catch (error) {

        console.error(
            "Scan Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// GET USER SCAN HISTORY
// ==========================================

exports.history = async (req, res) => {

    try {

        const scans =
            await ScanHistory.find({

                user:
                    req.user.id

            })
            .sort({

                createdAt: -1

            });


        res.json({

            success: true,

            count:
                scans.length,

            scans

        });

    }

    catch (error) {

        console.error(
            "History Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};