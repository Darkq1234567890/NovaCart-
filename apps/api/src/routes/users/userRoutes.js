const express = require("express");

const { protect } = require("../../middleware/auth/authMiddleware");
const { getMyProfile } = require("../../controllers/users/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);

module.exports = router;