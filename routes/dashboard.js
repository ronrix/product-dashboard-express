const express = require("express");
const router = express.Router();

// controllers
const DashboardController = require("../controllers/DashboardController.js");

router.get("/dashboard", DashboardController.index);
router.get("/dashboard/admin", DashboardController.admin);
router.get("/users/edit", DashboardController.profile);
router.get("/logoff", DashboardController.logoff);

// post methods
router.post("/user/process_edit_information", DashboardController.process_edit_user_info);
router.post("/user/process_edit_password", DashboardController.process_edit_user_password);

module.exports = router;