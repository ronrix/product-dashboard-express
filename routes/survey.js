const express = require("express")
const router = express.Router();

// controllers
const SurveyController = require("../controllers/SurveyController.js");

router.get("/survey", SurveyController.survey);
router.get("/result", SurveyController.result);

// form
router.post("/survey/submit", SurveyController.submit);


module.exports = router;