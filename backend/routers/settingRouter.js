const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const settingsController =
    require("../controllers/settingsController");

const profileUpload =
    require("../middleware/profileUpload");


// ==========================================
// PROFILE
// ==========================================

router.get(
    "/profile",
    auth,
    settingsController.getProfile
);

router.put(
    "/profile",
    auth,
    settingsController.updateProfile
);


// ==========================================
// PROFILE PICTURE
// ==========================================

router.post(
    "/profile/picture",
    auth,
    profileUpload.single("profilePicture"),
    settingsController.updateProfilePicture
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.patch(
    "/password",
    auth,
    settingsController.changePassword
);


module.exports = router;