const ScanHistory = require("../models/ScanHistory");
const Alert = require("../models/Alert");

exports.getAnalytics = async (req, res) => {

    try {

        const userId = req.user.id;

        // ==========================================
        // ALL SCANS
        // ==========================================

        const scans = await ScanHistory.find({
            user: userId
        }).sort({
            createdAt: 1
        });


        // ==========================================
        // TOTAL SCANS
        // ==========================================

        const totalScans = scans.length;


        // ==========================================
        // SAFE / THREAT / WARNING
        // ==========================================

        const safeScans = scans.filter(scan =>
            Number(scan.riskScore || 0) < 50
        ).length;


        const warningScans = scans.filter(scan =>
            Number(scan.riskScore || 0) >= 50 &&
            Number(scan.riskScore || 0) < 80
        ).length;


        const threatScans = scans.filter(scan =>
            Number(scan.riskScore || 0) >= 80
        ).length;


        // ==========================================
        // AVERAGE RISK
        // ==========================================

        const totalRisk = scans.reduce(
            (sum, scan) =>
                sum + Number(scan.riskScore || 0),
            0
        );


        const averageRisk =
            totalScans > 0
                ? Math.round(totalRisk / totalScans)
                : 0;


        // ==========================================
        // HIGHEST RISK
        // ==========================================

        const highestRisk =
            totalScans > 0
                ? Math.max(
                    ...scans.map(
                        scan =>
                            Number(scan.riskScore || 0)
                    )
                )
                : 0;


        // ==========================================
        // ALERTS
        // ==========================================

        const totalAlerts =
            await Alert.countDocuments({
                user: userId
            });


        const unreadAlerts =
            await Alert.countDocuments({
                user: userId,
                isRead: false
            });


        const threats =
            await Alert.countDocuments({
                user: userId,
                type: "THREAT"
            });


        const warnings =
            await Alert.countDocuments({
                user: userId,
                type: "WARNING"
            });


        // ==========================================
        // DAILY ANALYTICS
        // ==========================================

        const dailyMap = {};

        scans.forEach(scan => {

            const date =
                new Date(
                    scan.createdAt
                ).toISOString()
                .split("T")[0];


            if (!dailyMap[date]) {

                dailyMap[date] = {

                    scans: 0,

                    riskTotal: 0,

                    highestRisk: 0

                };

            }


            const risk =
                Number(
                    scan.riskScore || 0
                );


            dailyMap[date].scans++;

            dailyMap[date].riskTotal += risk;


            if (
                risk >
                dailyMap[date].highestRisk
            ) {

                dailyMap[date].highestRisk =
                    risk;

            }

        });


        const dailyAnalytics =
            Object.entries(
                dailyMap
            ).map(
                ([date, value]) => ({

                    date,

                    scans:
                        value.scans,

                    averageRisk:
                        Math.round(
                            value.riskTotal /
                            value.scans
                        ),

                    highestRisk:
                        value.highestRisk

                })
            );


        // ==========================================
        // RECENT SCANS
        // ==========================================

        const recentScans =
            scans
                .slice(-10)
                .reverse();


        // ==========================================
        // RESPONSE
        // ==========================================

        res.json({

            success: true,

            summary: {

                totalScans,

                safeScans,

                warningScans,

                threatScans,

                averageRisk,

                highestRisk,

                totalAlerts,

                unreadAlerts,

                threats,

                warnings

            },

            dailyAnalytics,

            recentScans

        });

    }

    catch (error) {

        console.error(
            "Analytics Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to load analytics",

            error:
                error.message

        });

    }

};