const express = require("express")
const router = express.Router();

// controllers
const HomeController = require("../controllers/HomeController.js");

router.get("/", HomeController.index);
router.get("/profile", HomeController.profile);

// form routes
router.post("/login", HomeController.login);

module.exports = router;