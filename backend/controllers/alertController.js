const Alert = require("../models/Alert");


// ==========================================
// GET USER ALERTS
// ==========================================

exports.getAlerts = async (req, res) => {

    try {

        const alerts = await Alert.find({
            user: req.user.id
        })
        .sort({
            createdAt: -1
        })
        .limit(50);

        const unreadCount =
            await Alert.countDocuments({
                user: req.user.id,
                isRead: false
            });

        res.json({

            success: true,

            alerts,

            unreadCount

        });

    }

    catch (error) {

        console.error(
            "Get Alerts Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// MARK ONE ALERT AS READ
// ==========================================

exports.markAsRead = async (req, res) => {

    try {

        const alert =
            await Alert.findOneAndUpdate(

                {
                    _id: req.params.id,

                    user: req.user.id
                },

                {
                    isRead: true
                },

                {
                    new: true
                }

            );


        if (!alert) {

            return res.status(404).json({

                success: false,

                message: "Alert not found"

            });

        }


        res.json({

            success: true,

            alert

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// MARK ALL AS READ
// ==========================================

exports.markAllAsRead = async (req, res) => {

    try {

        await Alert.updateMany(

            {
                user: req.user.id,

                isRead: false
            },

            {
                isRead: true
            }

        );


        res.json({

            success: true,

            message: "All alerts marked as read"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================================
// DELETE ALERT
// ==========================================

exports.deleteAlert = async (req, res) => {

    try {

        const alert =
            await Alert.findOneAndDelete({

                _id: req.params.id,

                user: req.user.id

            });


        if (!alert) {

            return res.status(404).json({

                success: false,

                message: "Alert not found"

            });

        }


        res.json({

            success: true,

            message: "Alert deleted"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};