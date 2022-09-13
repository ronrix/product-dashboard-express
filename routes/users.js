const express = require("express")
const router = express.Router();

// controllers
const UsersController = require("../controllers/UsersController.js");

router.get("/", UsersController.index);
router.get("/login", UsersController.login);
router.get("/register", UsersController.register);

// form
router.post("/process_login", UsersController.handle_login);
router.post("/process_register", UsersController.handle_register);


module.exports = router;