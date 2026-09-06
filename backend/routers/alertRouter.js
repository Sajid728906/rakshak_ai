const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const alertController =
    require("../controllers/alertController");


// Get alerts
router.get(
    "/",
    auth,
    alertController.getAlerts
);


// Mark one as read
router.patch(
    "/:id/read",
    auth,
    alertController.markAsRead
);


// Mark all as read
router.patch(
    "/read-all",
    auth,
    alertController.markAllAsRead
);


// Delete
router.delete(
    "/:id",
    auth,
    alertController.deleteAlert
);


module.exports = router;