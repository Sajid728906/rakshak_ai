const User = require("../models/user");
const ScanHistory = require("../models/ScanHistory");


exports.dashboard = async (req, res) => {

    try {

        // ===============================
        // USER
        // ===============================

        const user =
            await User.findById(
                req.user.id
            )
            .select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // ===============================
        // TODAY START
        // ===============================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // ===============================
        // TODAY SCANS
        // ===============================

        const todayScans =
            await ScanHistory.countDocuments({

                user: req.user.id,

                createdAt: {
                    $gte: today
                }

            });


        // ===============================
        // RECENT ACTIVITY
        // ===============================

        const recentActivity =
            await ScanHistory.find({

                user: req.user.id

            })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .select(
                "type riskScore riskLevel threats blocked createdAt"
            );


        // ===============================
        // TOTAL SCANS
        // ===============================

        const totalScans =
            await ScanHistory.countDocuments({

                user: req.user.id

            });


        // ===============================
        // RESPONSE
        // ===============================

        res.json({

            success: true,

            user: {

                name:
                    user.name,

                email:
                    user.email,

                subscription:
                    user.subscription,

                riskScore:
                    user.riskScore,

                threatBlocked:
                    user.threatBlocked,

                protectedDevices:
                    user.protectedDevices,

                createdAt:
                    user.createdAt,

                lastLogin:
                    user.lastLogin

            },

            todayScans,

            totalScans,

            recentActivity

        });

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};