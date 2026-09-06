const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const scanController =
    require("../controllers/scanController");


// ==========================================
// AI SCAN
// ==========================================

router.post(
    "/",
    auth,
    scanController.scan
);


// ==========================================
// SCAN HISTORY
// ==========================================

router.get(
    "/history",
    auth,
    scanController.history
);


module.exports = router;