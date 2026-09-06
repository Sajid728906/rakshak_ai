const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const dashboardController = require("../controllers/dashboardController");

// Protected Dashboard API
router.get(
    "/",
    auth,
    dashboardController.dashboard
);

module.exports = router;